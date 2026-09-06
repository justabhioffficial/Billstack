package com.billstack.repository;

import com.billstack.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, String> {
    Optional<Subscription> findByUserId(String userId);
    Optional<Subscription> findByProviderSubscriptionId(String providerSubscriptionId);
    long countByPlanAndStatus(String plan, String status);
}
