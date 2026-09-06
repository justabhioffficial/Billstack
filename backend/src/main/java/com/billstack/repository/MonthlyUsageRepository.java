package com.billstack.repository;

import com.billstack.entity.MonthlyUsage;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MonthlyUsageRepository extends JpaRepository<MonthlyUsage, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT m FROM MonthlyUsage m WHERE m.userId = :userId AND m.yearMonth = :yearMonth")
    Optional<MonthlyUsage> findForUpdate(@Param("userId") String userId, @Param("yearMonth") String yearMonth);

    Optional<MonthlyUsage> findByUserIdAndYearMonth(String userId, String yearMonth);

    @Modifying
    @Query("UPDATE MonthlyUsage m SET m.receiptCount = m.receiptCount + 1 WHERE m.userId = :userId AND m.yearMonth = :yearMonth")
    int incrementUsage(@Param("userId") String userId, @Param("yearMonth") String yearMonth);
}
