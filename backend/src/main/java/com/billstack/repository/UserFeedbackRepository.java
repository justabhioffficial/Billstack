package com.billstack.repository;

import com.billstack.entity.UserFeedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFeedbackRepository extends JpaRepository<UserFeedback, String> {
    List<UserFeedback> findByUserIdOrderByCreatedAtDesc(String userId);
    Page<UserFeedback> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<UserFeedback> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
}
