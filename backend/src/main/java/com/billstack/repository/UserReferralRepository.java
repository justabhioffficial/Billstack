package com.billstack.repository;

import com.billstack.entity.UserReferral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserReferralRepository extends JpaRepository<UserReferral, String> {
    List<UserReferral> findByReferrerId(String referrerId);
    Optional<UserReferral> findByReferralCode(String referralCode);
    Optional<UserReferral> findByReferredId(String referredId);
    long countByReferrerIdAndStatus(String referrerId, String status);
    long countByReferrerId(String referrerId);
}
