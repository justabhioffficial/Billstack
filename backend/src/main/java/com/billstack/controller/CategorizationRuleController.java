package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.common.exception.ResourceNotFoundException;
import com.billstack.common.exception.UnauthorizedException;
import com.billstack.dto.CategorizationRuleDto;
import com.billstack.dto.CreateRuleRequest;
import com.billstack.entity.CategorizationRule;
import com.billstack.entity.Category;
import com.billstack.repository.CategorizationRuleRepository;
import com.billstack.repository.CategoryRepository;
import com.billstack.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/categorization-rules")
public class CategorizationRuleController {

    private final CategorizationRuleRepository ruleRepository;
    private final CategoryRepository categoryRepository;

    public CategorizationRuleController(CategorizationRuleRepository ruleRepository, CategoryRepository categoryRepository) {
        this.ruleRepository = ruleRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategorizationRuleDto>>> getRules(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<CategorizationRule> rules = ruleRepository.findByUserId(currentUser.getId());
        Map<String, Category> catMap = categoryRepository.findAllAvailableForUser(currentUser.getId()).stream()
                .collect(Collectors.toMap(Category::getId, Function.identity(), (a, b) -> a));

        List<CategorizationRuleDto> dtos = rules.stream().map(r -> {
            String catName = catMap.containsKey(r.getCategoryId()) ? catMap.get(r.getCategoryId()).getName() : "Other";
            return CategorizationRuleDto.fromEntity(r, catName);
        }).toList();

        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategorizationRuleDto>> createRule(
            @Valid @RequestBody CreateRuleRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CategorizationRule rule = new CategorizationRule();
        rule.setUserId(currentUser.getId());
        rule.setVendorPattern(request.getVendorPattern().trim());
        rule.setCategoryId(request.getCategoryId());
        rule.setActive(request.getActive() != null ? request.getActive() : true);

        rule = ruleRepository.save(rule);

        String catName = categoryRepository.findById(rule.getCategoryId()).map(Category::getName).orElse("Other");
        return ResponseEntity.ok(ApiResponse.success(CategorizationRuleDto.fromEntity(rule, catName), "Rule created successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRule(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CategorizationRule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));

        if (!rule.getUserId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You do not have permission to delete this rule.");
        }

        ruleRepository.delete(rule);
        return ResponseEntity.ok(ApiResponse.success(null, "Rule deleted successfully"));
    }
}
