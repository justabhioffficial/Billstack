package com.billstack.service;

import com.billstack.dto.ReferralDto;
import com.billstack.dto.ReferralStatsDto;
import com.billstack.entity.UserReferral;
import com.billstack.repository.UserReferralRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReferralService {

    private final UserReferralRepository referralRepository;
    private final AuditService auditService;

    public ReferralService(UserReferralRepository referralRepository, AuditService auditService) {
        this.referralRepository = referralRepository;
        this.auditService = auditService;
    }

    public String getOrCreateReferralCode(String userId) {
        List<UserReferral> existing = referralRepository.findByReferrerId(userId);
        if (!existing.isEmpty()) {
            return existing.get(0).getReferralCode();
        }
        String code = "REF-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        UserReferral ref = new UserReferral(userId, code);
        referralRepository.save(ref);
        return code;
    }

    @Transactional
    public void trackReferralSignup(String referralCode, String newUserId) {
        if (referralCode == null || referralCode.trim().isEmpty()) return;

        Optional<UserReferral> template = referralRepository.findByReferralCode(referralCode.trim().toUpperCase());
        if (template.isPresent()) {
            UserReferral masterRef = template.get();
            // Prevent self-referrals
            if (masterRef.getReferrerId().equals(newUserId)) {
                return;
            }
            UserReferral signupRef = new UserReferral();
            signupRef.setReferrerId(masterRef.getReferrerId());
            signupRef.setReferredId(newUserId);
            signupRef.setReferralCode(masterRef.getReferralCode());
            signupRef.setStatus("PENDING");
            referralRepository.save(signupRef);

            auditService.logAction(newUserId, "REFERRAL_SIGNUP", signupRef.getId(), null, null, "SUCCESS", "Referred by code: " + referralCode);
        }
    }

    @Transactional
    public void activateReferralIfEligible(String userId) {
        Optional<UserReferral> pending = referralRepository.findByReferredId(userId);
        if (pending.isPresent()) {
            UserReferral ref = pending.get();
            if ("PENDING".equals(ref.getStatus())) {
                ref.setStatus("ACTIVATED");
                ref.setRewardGranted("10_EXTRA_RECEIPT_CREDITS");
                ref.setActivatedAt(LocalDateTime.now());
                referralRepository.save(ref);

                auditService.logAction(ref.getReferrerId(), "REFERRAL_ACTIVATED_REWARD", ref.getId(), null, null, "SUCCESS", "Referral activated for user: " + userId);
            }
        }
    }

    public ReferralStatsDto getReferralStats(String userId, String baseUrl) {
        String code = getOrCreateReferralCode(userId);
        List<UserReferral> history = referralRepository.findByReferrerId(userId);

        long totalInvites = history.stream().filter(r -> r.getReferredId() != null).count();
        long activated = history.stream().filter(r -> "ACTIVATED".equals(r.getStatus()) || "REWARDED".equals(r.getStatus())).count();
        long pending = history.stream().filter(r -> "PENDING".equals(r.getStatus()) && r.getReferredId() != null).count();

        ReferralStatsDto stats = new ReferralStatsDto();
        stats.setReferralCode(code);
        stats.setReferralLink((baseUrl != null ? baseUrl : "http://localhost:5173") + "/register?ref=" + code);
        stats.setTotalInvites(totalInvites);
        stats.setActivatedReferrals(activated);
        stats.setPendingReferrals(pending);
        stats.setCurrentRewardBonus(activated * 10 + " Bonus Receipt Credits Granted");

        List<ReferralDto> dtos = history.stream()
                .filter(r -> r.getReferredId() != null)
                .map(ReferralDto::fromEntity)
                .collect(Collectors.toList());
        stats.setReferralHistory(dtos);

        return stats;
    }
}
