package com.billstack.repository;

import com.billstack.entity.RecurringExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecurringExpenseRepository extends JpaRepository<RecurringExpense, String> {

    List<RecurringExpense> findByUserIdAndStatusNotOrderByVendorNameAsc(String userId, String status);

    List<RecurringExpense> findByUserId(String userId);

    Optional<RecurringExpense> findByUserIdAndVendorNameIgnoreCase(String userId, String vendorName);

    Optional<RecurringExpense> findByIdAndUserId(String id, String userId);
}
