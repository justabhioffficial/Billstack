package com.billstack.service;

import com.billstack.entity.CategorizationRule;
import com.billstack.entity.Category;
import com.billstack.repository.CategorizationRuleRepository;
import com.billstack.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CategorizationService {

    private final CategorizationRuleRepository ruleRepository;
    private final CategoryRepository categoryRepository;

    private static final Map<String, String> DEFAULT_KEYWORD_MAP = new HashMap<>();

    static {
        // Software & Tools
        DEFAULT_KEYWORD_MAP.put("aws", "cat-sw-tools");
        DEFAULT_KEYWORD_MAP.put("amazon web services", "cat-sw-tools");
        DEFAULT_KEYWORD_MAP.put("microsoft", "cat-sw-tools");
        DEFAULT_KEYWORD_MAP.put("github", "cat-sw-tools");
        DEFAULT_KEYWORD_MAP.put("vercel", "cat-sw-tools");
        DEFAULT_KEYWORD_MAP.put("openai", "cat-sw-tools");
        DEFAULT_KEYWORD_MAP.put("adobe", "cat-sw-tools");
        DEFAULT_KEYWORD_MAP.put("figma", "cat-sw-tools");
        DEFAULT_KEYWORD_MAP.put("jetbrains", "cat-sw-tools");

        // Internet & Phone
        DEFAULT_KEYWORD_MAP.put("airtel", "cat-internet-phone");
        DEFAULT_KEYWORD_MAP.put("jio", "cat-internet-phone");
        DEFAULT_KEYWORD_MAP.put("vodafone", "cat-internet-phone");
        DEFAULT_KEYWORD_MAP.put("broadband", "cat-internet-phone");

        // Travel
        DEFAULT_KEYWORD_MAP.put("uber", "cat-travel");
        DEFAULT_KEYWORD_MAP.put("ola", "cat-travel");
        DEFAULT_KEYWORD_MAP.put("indigo", "cat-travel");
        DEFAULT_KEYWORD_MAP.put("irctc", "cat-travel");
        DEFAULT_KEYWORD_MAP.put("petrol", "cat-travel");
        DEFAULT_KEYWORD_MAP.put("fuel", "cat-travel");

        // Food
        DEFAULT_KEYWORD_MAP.put("swiggy", "cat-food");
        DEFAULT_KEYWORD_MAP.put("zomato", "cat-food");
        DEFAULT_KEYWORD_MAP.put("starbucks", "cat-food");
        DEFAULT_KEYWORD_MAP.put("restaurant", "cat-food");
        DEFAULT_KEYWORD_MAP.put("cafe", "cat-food");

        // Equipment
        DEFAULT_KEYWORD_MAP.put("reliance digital", "cat-equipment");
        DEFAULT_KEYWORD_MAP.put("apple", "cat-equipment");
        DEFAULT_KEYWORD_MAP.put("croma", "cat-equipment");

        // Marketing
        DEFAULT_KEYWORD_MAP.put("google ads", "cat-marketing");
        DEFAULT_KEYWORD_MAP.put("facebook", "cat-marketing");
        DEFAULT_KEYWORD_MAP.put("meta", "cat-marketing");

        // Office Supplies
        DEFAULT_KEYWORD_MAP.put("staples", "cat-office-supplies");
        DEFAULT_KEYWORD_MAP.put("paper", "cat-office-supplies");

        // Education
        DEFAULT_KEYWORD_MAP.put("udemy", "cat-education");
        DEFAULT_KEYWORD_MAP.put("coursera", "cat-education");
    }

    public CategorizationService(CategorizationRuleRepository ruleRepository, CategoryRepository categoryRepository) {
        this.ruleRepository = ruleRepository;
        this.categoryRepository = categoryRepository;
    }

    public String categorizeVendor(String userId, String vendorName) {
        if (vendorName == null || vendorName.trim().isEmpty()) {
            return "cat-other";
        }

        String vendorLower = vendorName.toLowerCase().trim();

        // 1. Check user custom rules first (Higher priority)
        List<CategorizationRule> userRules = ruleRepository.findByUserIdAndActiveTrue(userId);
        for (CategorizationRule rule : userRules) {
            if (vendorLower.contains(rule.getVendorPattern().toLowerCase().trim())) {
                return rule.getCategoryId();
            }
        }

        // 2. Check default keyword mappings
        for (Map.Entry<String, String> entry : DEFAULT_KEYWORD_MAP.entrySet()) {
            if (vendorLower.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        return "cat-other";
    }
}
