package com.billstack.service;

import com.billstack.dto.StreakDto;
import com.billstack.dto.UserMilestoneDto;
import com.billstack.entity.Receipt;
import com.billstack.entity.UserMilestone;
import com.billstack.repository.ReceiptRepository;
import com.billstack.repository.UserMilestoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
public class GamificationService {

    private final UserMilestoneRepository milestoneRepository;
    private final ReceiptRepository receiptRepository;

    public GamificationService(UserMilestoneRepository milestoneRepository, ReceiptRepository receiptRepository) {
        this.milestoneRepository = milestoneRepository;
        this.receiptRepository = receiptRepository;
    }

    @Transactional
    public List<UserMilestoneDto> getMilestones(String userId) {
        evaluateMilestones(userId);
        List<UserMilestone> milestones = milestoneRepository.findByUserIdOrderByAchievedAtDesc(userId);
        return milestones.stream().map(UserMilestoneDto::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public StreakDto getStreaks(String userId) {
        long totalCount = receiptRepository.countByUserId(userId);
        List<Receipt> receipts = receiptRepository.findByUserId(userId);

        if (receipts.isEmpty()) {
            return new StreakDto(0, 0, 0, "Upload your first receipt to start your streak!");
        }

        Set<LocalDate> activeWeeks = new HashSet<>();
        Set<String> activeMonths = new HashSet<>();

        for (Receipt r : receipts) {
            LocalDate d = r.getReceiptDate() != null ? r.getReceiptDate() : r.getCreatedAt().toLocalDate();
            activeWeeks.add(d.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)));
            activeMonths.add(String.format("%d-%02d", d.getYear(), d.getMonthValue()));
        }

        int weekStreak = calculateConsecutiveWeeks(activeWeeks);
        int monthStreak = activeMonths.size();

        String label = String.format("🔥 %d-week expense tracking streak", Math.max(1, weekStreak));
        return new StreakDto(Math.max(1, weekStreak), Math.max(1, monthStreak), totalCount, label);
    }

    @Transactional
    public void evaluateMilestones(String userId) {
        long totalCount = receiptRepository.countByUserId(userId);

        if (totalCount >= 1) {
            awardMilestoneIfNew(userId, "FIRST_RECEIPT", "First Receipt Organized", "Uploaded and processed your first expense receipt on BillStack.");
        }
        if (totalCount >= 10) {
            awardMilestoneIfNew(userId, "TEN_RECEIPTS", "10 Receipts Milestone", "Successfully organized 10 receipts with verified expense data.");
        }
        if (totalCount >= 50) {
            awardMilestoneIfNew(userId, "FIFTY_RECEIPTS", "50 Receipts Organized", "Reached 50 organized receipts in your digital archive.");
        }
        if (totalCount >= 100) {
            awardMilestoneIfNew(userId, "HUNDRED_RECEIPTS", "100 Receipts Organized", "Achieved 100 organized expense records on BillStack.");
        }
        if (totalCount >= 1000) {
            awardMilestoneIfNew(userId, "THOUSAND_RECEIPTS", "1,000 Power User", "Organized over 1,000 receipts in your business account.");
        }
    }

    private void awardMilestoneIfNew(String userId, String key, String title, String description) {
        if (!milestoneRepository.existsByUserIdAndMilestoneKey(userId, key)) {
            milestoneRepository.save(new UserMilestone(userId, key, title, description));
        }
    }

    private int calculateConsecutiveWeeks(Set<LocalDate> activeWeeks) {
        if (activeWeeks.isEmpty()) return 0;
        List<LocalDate> sorted = new ArrayList<>(activeWeeks);
        Collections.sort(sorted, Collections.reverseOrder());

        LocalDate current = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        int streak = 0;

        for (LocalDate week : sorted) {
            if (week.equals(current) || week.equals(current.minusWeeks(1))) {
                streak++;
                current = week.minusWeeks(1);
            } else if (week.isBefore(current.minusWeeks(1))) {
                break;
            }
        }
        return streak;
    }
}
