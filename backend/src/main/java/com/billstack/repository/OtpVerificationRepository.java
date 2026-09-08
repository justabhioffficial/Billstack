package com.billstack.repository;

import com.billstack.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, String> {

    @Query("SELECT o FROM OtpVerification o WHERE LOWER(o.email) = LOWER(:email) AND o.purpose = :purpose AND o.consumed = false AND o.expiresAt > :now ORDER BY o.createdAt DESC")
    List<OtpVerification> findValidOtps(
            @Param("email") String email,
            @Param("purpose") String purpose,
            @Param("now") LocalDateTime now
    );

    default Optional<OtpVerification> findLatestValidOtp(String email, String purpose, LocalDateTime now) {
        List<OtpVerification> list = findValidOtps(email, purpose, now);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Modifying
    @Query("UPDATE OtpVerification o SET o.consumed = true WHERE LOWER(o.email) = LOWER(:email) AND o.purpose = :purpose AND o.consumed = false")
    void invalidatePreviousOtps(@Param("email") String email, @Param("purpose") String purpose);
}
