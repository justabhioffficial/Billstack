package com.billstack.repository;

import com.billstack.entity.ReceiptField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiptFieldRepository extends JpaRepository<ReceiptField, String> {
    List<ReceiptField> findByReceiptId(String receiptId);
    void deleteByReceiptId(String receiptId);
}
