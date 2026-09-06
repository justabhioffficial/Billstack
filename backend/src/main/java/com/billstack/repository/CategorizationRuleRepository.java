package com.billstack.repository;

import com.billstack.entity.CategorizationRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategorizationRuleRepository extends JpaRepository<CategorizationRule, String> {
    List<CategorizationRule> findByUserIdAndActiveTrue(String userId);
    List<CategorizationRule> findByUserId(String userId);
}
