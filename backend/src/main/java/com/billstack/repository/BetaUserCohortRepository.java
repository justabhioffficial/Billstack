package com.billstack.repository;

import com.billstack.entity.BetaUserCohort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BetaUserCohortRepository extends JpaRepository<BetaUserCohort, String> {
    Optional<BetaUserCohort> findByUserId(String userId);
}
