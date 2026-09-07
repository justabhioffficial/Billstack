package com.billstack.repository;

import com.billstack.entity.UserMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserMilestoneRepository extends JpaRepository<UserMilestone, String> {

    List<UserMilestone> findByUserIdOrderByAchievedAtDesc(String userId);

    boolean existsByUserIdAndMilestoneKey(String userId, String milestoneKey);

    Optional<UserMilestone> findByUserIdAndMilestoneKey(String userId, String milestoneKey);
}
