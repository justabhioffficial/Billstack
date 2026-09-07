package com.billstack.service;

import com.billstack.entity.BetaUserCohort;
import com.billstack.repository.BetaUserCohortRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class BetaCohortService {

    private final BetaUserCohortRepository cohortRepository;

    public BetaCohortService(BetaUserCohortRepository cohortRepository) {
        this.cohortRepository = cohortRepository;
    }

    @Transactional
    public BetaUserCohort getOrCreateUserCohort(String userId) {
        Optional<BetaUserCohort> opt = cohortRepository.findByUserId(userId);
        if (opt.isPresent()) {
            return opt.get();
        }
        BetaUserCohort cohort = new BetaUserCohort(userId, "PHASE_1", "{\"copilot\": true, \"beta_analytics\": true}");
        return cohortRepository.save(cohort);
    }

    @Transactional
    public void markOnboardingComplete(String userId) {
        BetaUserCohort cohort = getOrCreateUserCohort(userId);
        cohort.setOnboardingCompleted(true);
        cohortRepository.save(cohort);
    }
}
