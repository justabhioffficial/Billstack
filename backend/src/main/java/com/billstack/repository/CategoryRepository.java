package com.billstack.repository;

import com.billstack.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    
    @Query("SELECT c FROM Category c WHERE c.isDefault = true OR c.userId = :userId ORDER BY c.name ASC")
    List<Category> findAllAvailableForUser(@Param("userId") String userId);

    List<Category> findByUserId(String userId);
    List<Category> findByIsDefaultTrue();
}
