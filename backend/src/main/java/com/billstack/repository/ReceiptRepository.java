package com.billstack.repository;

import com.billstack.entity.Receipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, String> {

    Optional<Receipt> findByIdAndUserId(String id, String userId);

    List<Receipt> findByUserId(String userId);

    boolean existsByUserIdAndReceiptNumber(String userId, String receiptNumber);

    @Query("SELECT r FROM Receipt r WHERE r.userId = :userId " +
           "AND (:excludeId IS NULL OR r.id <> :excludeId) " +
           "AND r.receiptDate >= :startDate AND r.receiptDate <= :endDate " +
           "AND (" +
           "     (:receiptNumber IS NOT NULL AND TRIM(:receiptNumber) <> '' AND LOWER(TRIM(r.receiptNumber)) = LOWER(TRIM(:receiptNumber))) " +
           "     OR " +
           "     (:vendorName IS NOT NULL AND TRIM(:vendorName) <> '' AND r.totalAmount IS NOT NULL AND LOWER(TRIM(r.vendorName)) = LOWER(TRIM(:vendorName)) AND r.totalAmount = :totalAmount)" +
           ")")
    List<Receipt> findDuplicateInMonth(
            @Param("userId") String userId,
            @Param("excludeId") String excludeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("receiptNumber") String receiptNumber,
            @Param("vendorName") String vendorName,
            @Param("totalAmount") BigDecimal totalAmount
    );

    @Query("SELECT r FROM Receipt r WHERE r.userId = :userId " +
           "AND (:categoryId IS NULL OR r.categoryId = :categoryId) " +
           "AND (:isBusiness IS NULL OR r.isBusiness = :isBusiness) " +
           "AND (:status IS NULL OR r.ocrStatus = :status) " +
           "AND (:startDate IS NULL OR r.receiptDate >= :startDate) " +
           "AND (:endDate IS NULL OR r.receiptDate <= :endDate) " +
           "AND (:search IS NULL OR LOWER(r.vendorName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(r.receiptNumber) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(r.ocrRawText) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR CAST(r.totalAmount AS string) LIKE CONCAT('%', :search, '%')) " +
           "ORDER BY r.receiptDate DESC, r.createdAt DESC")
    Page<Receipt> findWithFilters(
            @Param("userId") String userId,
            @Param("categoryId") String categoryId,
            @Param("isBusiness") Boolean isBusiness,
            @Param("status") String status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT r FROM Receipt r WHERE r.userId = :userId " +
           "AND (:vendor IS NULL OR LOWER(r.vendorName) LIKE LOWER(CONCAT('%', :vendor, '%'))) " +
           "AND (:categoryId IS NULL OR r.categoryId = :categoryId) " +
           "AND (:minAmount IS NULL OR r.totalAmount >= :minAmount) " +
           "AND (:maxAmount IS NULL OR r.totalAmount <= :maxAmount) " +
           "AND (:startDate IS NULL OR r.receiptDate >= :startDate) " +
           "AND (:endDate IS NULL OR r.receiptDate <= :endDate) " +
           "AND (:paymentMode IS NULL OR LOWER(r.paymentMode) = LOWER(:paymentMode)) " +
           "AND (:hasGst IS NULL OR (:hasGst = true AND r.taxAmount > 0) OR (:hasGst = false AND (r.taxAmount IS NULL OR r.taxAmount = 0))) " +
           "AND (:status IS NULL OR r.ocrStatus = :status) " +
           "AND (:isBusiness IS NULL OR r.isBusiness = :isBusiness) " +
           "AND (:search IS NULL OR LOWER(r.vendorName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(r.receiptNumber) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(r.ocrRawText) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY r.receiptDate DESC, r.createdAt DESC")
    Page<Receipt> findAdvancedReceipts(
            @Param("userId") String userId,
            @Param("vendor") String vendor,
            @Param("categoryId") String categoryId,
            @Param("minAmount") BigDecimal minAmount,
            @Param("maxAmount") BigDecimal maxAmount,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("paymentMode") String paymentMode,
            @Param("hasGst") Boolean hasGst,
            @Param("status") String status,
            @Param("isBusiness") Boolean isBusiness,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT r FROM Receipt r WHERE r.userId = :userId " +
           "AND (:startDate IS NULL OR r.receiptDate >= :startDate) " +
           "AND (:endDate IS NULL OR r.receiptDate <= :endDate) " +
           "ORDER BY r.receiptDate ASC")
    List<Receipt> findForExport(
            @Param("userId") String userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    List<Receipt> findTop5ByUserIdOrderByCreatedAtDesc(String userId);

    List<Receipt> findByUserIdAndReceiptDateBetween(String userId, LocalDate startDate, LocalDate endDate);

    List<Receipt> findByUserIdAndReceiptDateBetweenOrderByReceiptDateAsc(String userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(r.totalAmount), 0) FROM Receipt r WHERE r.userId = :userId " +
           "AND r.receiptDate >= :startDate AND r.receiptDate <= :endDate")
    BigDecimal sumTotalByUserIdAndDateRange(@Param("userId") String userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(r.totalAmount), 0) FROM Receipt r WHERE r.userId = :userId " +
           "AND r.isBusiness = true AND r.receiptDate >= :startDate AND r.receiptDate <= :endDate")
    BigDecimal sumBusinessByUserIdAndDateRange(@Param("userId") String userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(r.totalAmount), 0) FROM Receipt r WHERE r.userId = :userId " +
           "AND r.isBusiness = false AND r.receiptDate >= :startDate AND r.receiptDate <= :endDate")
    BigDecimal sumPersonalByUserIdAndDateRange(@Param("userId") String userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    long countByUserId(String userId);

    long countByOcrStatus(String ocrStatus);

    @Query("SELECT COUNT(r) FROM Receipt r WHERE r.userId = :userId " +
           "AND r.receiptDate >= :startDate AND r.receiptDate <= :endDate")
    long countByUserIdAndDateRange(@Param("userId") String userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT r.categoryId, COALESCE(SUM(r.totalAmount), 0), COUNT(r) FROM Receipt r " +
           "WHERE r.userId = :userId AND r.receiptDate >= :startDate AND r.receiptDate <= :endDate " +
           "GROUP BY r.categoryId")
    List<Object[]> aggregateByCategory(@Param("userId") String userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT r.vendorName, COALESCE(SUM(r.totalAmount), 0), COUNT(r) FROM Receipt r " +
           "WHERE r.userId = :userId AND r.receiptDate >= :startDate AND r.receiptDate <= :endDate " +
           "GROUP BY r.vendorName ORDER BY SUM(r.totalAmount) DESC")
    List<Object[]> aggregateByVendor(@Param("userId") String userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT DISTINCT r.vendorName FROM Receipt r WHERE r.userId = :userId AND r.vendorName IS NOT NULL AND TRIM(r.vendorName) <> ''")
    List<String> findDistinctVendorsByUserId(@Param("userId") String userId);

    @Query("SELECT r FROM Receipt r WHERE r.userId = :userId AND LOWER(TRIM(r.vendorName)) = LOWER(TRIM(:vendorName)) ORDER BY r.receiptDate DESC")
    List<Receipt> findByUserIdAndVendorName(@Param("userId") String userId, @Param("vendorName") String vendorName);

    @Query("SELECT r.vendorName, COUNT(r), COALESCE(SUM(r.totalAmount), 0), COALESCE(AVG(r.totalAmount), 0), COALESCE(MAX(r.totalAmount), 0) " +
           "FROM Receipt r WHERE r.userId = :userId AND r.vendorName IS NOT NULL AND TRIM(r.vendorName) <> '' " +
           "GROUP BY r.vendorName ORDER BY SUM(r.totalAmount) DESC")
    List<Object[]> aggregateVendorStats(@Param("userId") String userId);
}
