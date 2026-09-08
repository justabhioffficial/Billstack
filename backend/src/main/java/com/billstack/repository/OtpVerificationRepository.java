package com.billstack.repository;

import com.billstack.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, String> {

    @Query("SELECT o FROM OtpVerification o WHERE LOWER(o.email) = LOWER(:email) AND o.purpose = :purpose AND o.consumed = false AND o.expiresAt > :now ORDER BY o.createdAt DESC LIMIT 1")
    Optional<OtpVerification> findLatestValidOtp(
            @Param("email") String email,
            @Param("purpose") String purpose,
            @Param("now") LocalDateTime now
    );

    @Modifying
    @Query("UPDATE OtpVerification o SET o.consumed = true WHERE LOWER(o.email) = LOWER(:email) AND o.purpose = :purpose AND o.consumed = false")
    void invalidatePreviousOtps(@Param("email") String email, @Param("purpose") String purpose);
}
