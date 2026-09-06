package com.billstack.service;

import com.billstack.common.exception.BadRequestException;
import com.billstack.common.exception.ResourceNotFoundException;
import com.billstack.common.exception.UnauthorizedException;
import com.billstack.dto.*;
import com.billstack.email.EmailService;
import com.billstack.entity.AuditLog;
import com.billstack.entity.RefreshToken;
import com.billstack.entity.Subscription;
import com.billstack.entity.User;
import com.billstack.repository.AuditLogRepository;
import com.billstack.repository.RefreshTokenRepository;
import com.billstack.repository.SubscriptionRepository;
import com.billstack.repository.UserRepository;
import com.billstack.security.JwtTokenProvider;
import com.billstack.security.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    public AuthService(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            SubscriptionRepository subscriptionRepository,
            AuditLogRepository auditLogRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email address is already registered.");
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setBusinessType(request.getBusinessType());
        user.setCountry(request.getCountry() != null ? request.getCountry() : "India");
        user.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR");
        user.setRole("USER");
        user = userRepository.save(user);

        // Initialize default free subscription
        Subscription subscription = new Subscription();
        subscription.setUserId(user.getId());
        subscription.setPlan("FREE");
        subscription.setStatus("ACTIVE");
        subscription.setCurrentPeriodStart(LocalDateTime.now());
        subscription.setCurrentPeriodEnd(LocalDateTime.now().plusYears(1));
        subscriptionRepository.save(subscription);

        // Audit Log
        auditLogRepository.save(new AuditLog(user.getId(), "USER_REGISTER", "USER", user.getId(), "User registered successfully"));

        // Email Notification
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshTokenStr = tokenProvider.generateRefreshToken(principal);

        saveRefreshToken(user.getId(), refreshTokenStr);

        return new AuthResponse(accessToken, refreshTokenStr, tokenProvider.getExpirationMs(), UserDto.fromEntity(user));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshTokenStr = tokenProvider.generateRefreshToken(principal);

        saveRefreshToken(user.getId(), refreshTokenStr);

        auditLogRepository.save(new AuditLog(user.getId(), "USER_LOGIN", "USER", user.getId(), "User logged in"));

        return new AuthResponse(accessToken, refreshTokenStr, tokenProvider.getExpirationMs(), UserDto.fromEntity(user));
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String tokenStr = request.getRefreshToken();
        if (!tokenProvider.validateToken(tokenStr)) {
            throw new UnauthorizedException("Invalid or expired refresh token.");
        }

        String userId = tokenProvider.getUserIdFromToken(tokenStr);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserPrincipal principal = UserPrincipal.create(user);
        String newAccessToken = tokenProvider.generateAccessToken(principal);
        String newRefreshToken = tokenProvider.generateRefreshToken(principal);

        saveRefreshToken(user.getId(), newRefreshToken);

        return new AuthResponse(newAccessToken, newRefreshToken, tokenProvider.getExpirationMs(), UserDto.fromEntity(user));
    }

    @Transactional
    public void logout(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
        auditLogRepository.save(new AuditLog(userId, "USER_LOGOUT", "USER", userId, "User logged out"));
    }

    @Transactional(readOnly = true)
    public UserDto getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto updateUserProfile(String userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getBusinessType() != null) user.setBusinessType(request.getBusinessType());
        if (request.getCountry() != null) user.setCountry(request.getCountry());
        if (request.getCurrency() != null) user.setCurrency(request.getCurrency());

        user = userRepository.save(user);
        return UserDto.fromEntity(user);
    }

    private void saveRefreshToken(String userId, String tokenStr) {
        refreshTokenRepository.deleteByUserId(userId);
        RefreshToken token = new RefreshToken();
        token.setUserId(userId);
        token.setTokenHash(tokenStr);
        token.setExpiresAt(LocalDateTime.now().plusDays(7));
        refreshTokenRepository.save(token);
    }
}
