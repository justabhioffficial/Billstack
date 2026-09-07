package com.billstack.repository;

import com.billstack.entity.ProductAnalyticsEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductAnalyticsEventRepository extends JpaRepository<ProductAnalyticsEvent, String> {
    long countByEventName(String eventName);

    @Query("SELECT e.eventName, COUNT(e) FROM ProductAnalyticsEvent e WHERE e.createdAt >= :startDate GROUP BY e.eventName")
    List<Object[]> countEventsByGroupSince(@Param("startDate") LocalDateTime startDate);
}
