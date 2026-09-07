package com.billstack.repository;

import com.billstack.entity.ExpenseAlert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseAlertRepository extends JpaRepository<ExpenseAlert, String> {

    List<ExpenseAlert> findByUserIdAndIsDismissedFalseOrderByCreatedAtDesc(String userId);

    Page<ExpenseAlert> findByUserIdAndIsDismissedFalse(String userId, Pageable pageable);

    long countByUserIdAndIsReadFalseAndIsDismissedFalse(String userId);

    Optional<ExpenseAlert> findByIdAndUserId(String id, String userId);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM ExpenseAlert a WHERE a.userId = :userId AND a.alertType = :alertType AND a.title = :title AND a.isDismissed = false")
    boolean existsSimilarAlert(@Param("userId") String userId, @Param("alertType") String alertType, @Param("title") String title);
}
