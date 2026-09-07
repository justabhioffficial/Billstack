package com.billstack.repository;

import com.billstack.entity.SubscriptionCancellation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionCancellationRepository extends JpaRepository<SubscriptionCancellation, String> {
    List<SubscriptionCancellation> findByUserId(String userId);
}
