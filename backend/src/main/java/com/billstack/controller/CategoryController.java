package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.dto.CategoryDto;
import com.billstack.dto.CreateCategoryRequest;
import com.billstack.entity.Category;
import com.billstack.repository.CategoryRepository;
import com.billstack.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<Category> categories = categoryRepository.findAllAvailableForUser(currentUser.getId());
        List<CategoryDto> dtos = categories.stream().map(CategoryDto::fromEntity).toList();
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(
            @Valid @RequestBody CreateCategoryRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Category category = new Category();
        category.setUserId(currentUser.getId());
        category.setName(request.getName());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());
        category.setDefault(false);

        category = categoryRepository.save(category);
        return ResponseEntity.ok(ApiResponse.success(CategoryDto.fromEntity(category), "Custom category created"));
    }
}
