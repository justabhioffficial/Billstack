package com.billstack.service;

import com.billstack.common.exception.BadRequestException;
import com.billstack.common.exception.ResourceNotFoundException;
import com.billstack.common.exception.UnauthorizedException;
import com.billstack.dto.*;
import com.billstack.email.EmailJsService;
import com.billstack.email.EmailService;
import com.billstack.entity.AuditLog;
import com.billstack.entity.OtpVerification;
import com.billstack.entity.RefreshToken;
import com.billstack.entity.Subscription;
import com.billstack.entity.User;
import com.billstack.repository.AuditLogRepository;
import com.billstack.repository.OtpVerificationRepository;
import com.billstack.repository.RefreshTokenRepository;
import com.billstack.repository.SubscriptionRepository;
import com.billstack.repository.UserRepository;
import com.billstack.security.JwtTokenProvider;
import com.billstack.security.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final AuditLogRepository auditLogRepository;
    private final OtpVerificationRepository otpVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;
    private final EmailJsService emailJsService;

    public AuthService(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            SubscriptionRepository subscriptionRepository,
            AuditLogRepository auditLogRepository,
            OtpVerificationRepository otpVerificationRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            EmailService emailService,
            EmailJsService emailJsService
    ) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.auditLogRepository = auditLogRepository;
        this.otpVerificationRepository = otpVerificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
        this.emailJsService = emailJsService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email address is already registered.");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setBusinessType(request.getBusinessType());
        user.setCountry(request.getCountry() != null ? request.getCountry() : "India");
        user.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR");
        user.setRole("USER");
        user.setEmailVerified(false); // Unverified until OTP is verified
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
        auditLogRepository.save(new AuditLog(user.getId(), "USER_REGISTER", "USER", user.getId(), "User registered, pending OTP verification"));

        // Generate & Send Registration OTP
        sendAndStoreOtp(email, "REGISTRATION_VERIFICATION");

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshTokenStr = tokenProvider.generateRefreshToken(principal);

        saveRefreshToken(user.getId(), refreshTokenStr);

        return new AuthResponse(accessToken, refreshTokenStr, tokenProvider.getExpirationMs(), UserDto.fromEntity(user));
    }

    @Transactional
    public AuthResponse verifyRegistrationOtp(VerifyOtpRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        validateOtp(email, request.getOtp(), "REGISTRATION_VERIFICATION");

        user.setEmailVerified(true);
        userRepository.save(user);

        auditLogRepository.save(new AuditLog(user.getId(), "EMAIL_VERIFIED", "USER", user.getId(), "User verified email via OTP"));

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshTokenStr = tokenProvider.generateRefreshToken(principal);

        saveRefreshToken(user.getId(), refreshTokenStr);

        return new AuthResponse(accessToken, refreshTokenStr, tokenProvider.getExpirationMs(), UserDto.fromEntity(user));
    }

    @Transactional
    public void resendOtp(ResendOtpRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        String purpose = request.getPurpose() != null ? request.getPurpose() : "REGISTRATION_VERIFICATION";

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + email));

        sendAndStoreOtp(email, purpose);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        if (!user.isEmailVerified()) {
            // Trigger new registration OTP for unverified account
            sendAndStoreOtp(email, "REGISTRATION_VERIFICATION");
            throw new BadRequestException("Your email is not verified yet. A verification OTP has been sent to your email.");
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshTokenStr = tokenProvider.generateRefreshToken(principal);

        saveRefreshToken(user.getId(), refreshTokenStr);

        auditLogRepository.save(new AuditLog(user.getId(), "USER_LOGIN", "USER", user.getId(), "User logged in with password"));

        return new AuthResponse(accessToken, refreshTokenStr, tokenProvider.getExpirationMs(), UserDto.fromEntity(user));
    }

    @Transactional
    public void requestLoginOtp(ForgotPasswordRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account found with email: " + email));

        if (!user.isEmailVerified()) {
            throw new BadRequestException("Your account is not verified yet. Please complete email verification first.");
        }

        sendAndStoreOtp(email, "LOGIN");
    }

    @Transactional
    public AuthResponse loginWithOtp(VerifyOtpRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        validateOtp(email, request.getOtp(), "LOGIN");

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshTokenStr = tokenProvider.generateRefreshToken(principal);

        saveRefreshToken(user.getId(), refreshTokenStr);

        auditLogRepository.save(new AuditLog(user.getId(), "USER_LOGIN_OTP", "USER", user.getId(), "User logged in with OTP"));

        return new AuthResponse(accessToken, refreshTokenStr, tokenProvider.getExpirationMs(), UserDto.fromEntity(user));
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + email));

        sendAndStoreOtp(email, "PASSWORD_RESET");
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        validateOtp(email, request.getOtp(), "PASSWORD_RESET");

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Invalidate previous refresh tokens
        refreshTokenRepository.deleteByUserId(user.getId());

        auditLogRepository.save(new AuditLog(user.getId(), "PASSWORD_RESET", "USER", user.getId(), "User reset password successfully"));
    }

    @Transactional
    public void changePassword(String userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password does not match.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        auditLogRepository.save(new AuditLog(user.getId(), "PASSWORD_CHANGE", "USER", user.getId(), "User changed password successfully"));
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

    private void sendAndStoreOtp(String email, String purpose) {
        // Enforce 30s resend cooldown check
        Optional<OtpVerification> existingOpt = otpVerificationRepository.findLatestValidOtp(email, purpose, LocalDateTime.now());
        if (existingOpt.isPresent()) {
            OtpVerification existing = existingOpt.get();
            if (existing.getResendCooldownUntil() != null && existing.getResendCooldownUntil().isAfter(LocalDateTime.now())) {
                throw new BadRequestException("Please wait 30 seconds before requesting another OTP.");
            }
        }

        // Invalidate previous OTPs for this purpose
        otpVerificationRepository.invalidatePreviousOtps(email, purpose);

        // Generate 6-digit OTP
        String rawOtp = generateRandom6DigitOtp();
        String hashedOtp = hashOtp(rawOtp);

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);
        LocalDateTime cooldownUntil = LocalDateTime.now().plusSeconds(30);

        OtpVerification otpVerification = new OtpVerification(email, purpose, hashedOtp, expiresAt, cooldownUntil);
        otpVerificationRepository.save(otpVerification);

        // Dispatch via EmailJS Service
        emailJsService.sendOtpEmail(email, rawOtp, purpose);
    }

    private void validateOtp(String email, String rawOtp, String purpose) {
        OtpVerification otp = otpVerificationRepository.findLatestValidOtp(email, purpose, LocalDateTime.now())
                .orElseThrow(() -> new BadRequestException("OTP has expired or is invalid. Please request a new OTP."));

        if (otp.getAttemptCount() >= 5) {
            otp.setConsumed(true);
            otpVerificationRepository.save(otp);
            throw new BadRequestException("Maximum OTP verification attempts exceeded. Please request a new OTP.");
        }

        String inputHashed = hashOtp(rawOtp);
        if (!inputHashed.equals(otp.getOtpHash())) {
            otp.setAttemptCount(otp.getAttemptCount() + 1);
            otpVerificationRepository.save(otp);
            throw new BadRequestException("Invalid OTP code. Please check and try again.");
        }

        // Mark OTP consumed
        otp.setConsumed(true);
        otpVerificationRepository.save(otp);
    }

    private String generateRandom6DigitOtp() {
        SecureRandom random = new SecureRandom();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }

    private String hashOtp(String otp) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(otp.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 digest failed", e);
        }
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
