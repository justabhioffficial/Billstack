package com.billstack.service;

import com.billstack.entity.CategorizationRule;
import com.billstack.repository.CategorizationRuleRepository;
import com.billstack.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class CategorizationServiceTest {

    private CategorizationRuleRepository ruleRepository;
    private CategoryRepository categoryRepository;
    private CategorizationService categorizationService;

    @BeforeEach
    void setUp() {
        ruleRepository = Mockito.mock(CategorizationRuleRepository.class);
        categoryRepository = Mockito.mock(CategoryRepository.class);
        categorizationService = new CategorizationService(ruleRepository, categoryRepository);
    }

    @Test
    void testDefaultKeywordCategorization() {
        when(ruleRepository.findByUserIdAndActiveTrue(anyString())).thenReturn(Collections.emptyList());

        assertEquals("cat-sw-tools", categorizationService.categorizeVendor("u1", "AWS Cloud Services"));
        assertEquals("cat-travel", categorizationService.categorizeVendor("u1", "Uber India"));
        assertEquals("cat-food", categorizationService.categorizeVendor("u1", "Swiggy Order"));
    }

    @Test
    void testUserRulePriorityOverDefault() {
        CategorizationRule customRule = new CategorizationRule();
        customRule.setUserId("u1");
        customRule.setVendorPattern("Uber");
        customRule.setCategoryId("custom-office-cat");

        when(ruleRepository.findByUserIdAndActiveTrue("u1")).thenReturn(List.of(customRule));

        // User custom rule for Uber should override default travel category
        assertEquals("custom-office-cat", categorizationService.categorizeVendor("u1", "Uber Ride"));
    }
}
