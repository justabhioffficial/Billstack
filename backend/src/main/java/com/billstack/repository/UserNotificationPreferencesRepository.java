package com.billstack.repository;

import com.billstack.entity.UserNotificationPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserNotificationPreferencesRepository extends JpaRepository<UserNotificationPreferences, String> {

    Optional<UserNotificationPreferences> findByUserId(String userId);
}
