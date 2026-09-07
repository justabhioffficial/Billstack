package com.billstack.service;

import com.billstack.dto.AskQueryRequest;
import com.billstack.dto.AskQueryResponse;
import com.billstack.dto.ReceiptDto;
import com.billstack.entity.Category;
import com.billstack.entity.Receipt;
import com.billstack.repository.CategoryRepository;
import com.billstack.repository.ReceiptRepository;
import com.billstack.storage.StorageService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AskBillStackService {

    private final ReceiptRepository receiptRepository;
    private final CategoryRepository categoryRepository;
    private final StorageService storageService;

    public AskBillStackService(
            ReceiptRepository receiptRepository,
            CategoryRepository categoryRepository,
            StorageService storageService
    ) {
        this.receiptRepository = receiptRepository;
        this.categoryRepository = categoryRepository;
        this.storageService = storageService;
    }

    public AskQueryResponse processQuery(String userId, AskQueryRequest request) {
        if (request == null || request.getQuery() == null || request.getQuery().trim().isEmpty()) {
            return new AskQueryResponse("", "Please enter a query (e.g., 'How much did I spend on AWS in the last 6 months?')", BigDecimal.ZERO, 0, Collections.emptyList());
        }

        String rawQuery = request.getQuery().trim();
        String normalizedQuery = rawQuery.toLowerCase().replace(",", "");

        // Specialized Financial Copilot Intent Handlers

        // Intent 1: "Where did most of my money go?"
        if ((normalizedQuery.contains("where") && normalizedQuery.contains("money")) || normalizedQuery.contains("where did my money go")) {
            return handleWhereMoneyWentIntent(userId, rawQuery);
        }

        // Intent 2: "Compare this month with last month" / "Why did expenses increase?"
        if (normalizedQuery.contains("compare") || (normalizedQuery.contains("expenses") && (normalizedQuery.contains("increase") || normalizedQuery.contains("change") || normalizedQuery.contains("shift")))) {
            return handleMoMComparisonIntent(userId, rawQuery);
        }

        // Intent 3: "What vendors am I spending the most with?" / "Top vendors"
        if (normalizedQuery.contains("vendor") && (normalizedQuery.contains("most") || normalizedQuery.contains("top") || normalizedQuery.contains("spending"))) {
            return handleTopVendorsIntent(userId, rawQuery);
        }

        // Intent 4: "Show pending receipts needing review" / "What expenses should I review?"
        if ((normalizedQuery.contains("pending") || normalizedQuery.contains("review")) && (normalizedQuery.contains("receipt") || normalizedQuery.contains("need") || normalizedQuery.contains("queue") || normalizedQuery.contains("show"))) {
            return handleReviewQueueIntent(userId, rawQuery);
        }

        // Intent 5: "Show me my largest expenses" / "Highest expense"
        if (normalizedQuery.contains("largest") || normalizedQuery.contains("highest") || normalizedQuery.contains("biggest")) {
            return handleLargestExpensesIntent(userId, rawQuery);
        }

        // Intent 6: Advanced Financial NLP Engine (Date, Amount Range, Category Resolution, Vendor Matching)
        return handleStandardSpendingSearch(userId, rawQuery, normalizedQuery);
    }

    private AskQueryResponse handleWhereMoneyWentIntent(String userId, String rawQuery) {
        LocalDate start = LocalDate.now().withDayOfMonth(1);
        LocalDate end = LocalDate.now();

        List<Receipt> receipts = receiptRepository.findByUserId(userId).stream()
                .filter(r -> {
                    LocalDate d = r.getReceiptDate() != null ? r.getReceiptDate() : (r.getCreatedAt() != null ? r.getCreatedAt().toLocalDate() : null);
                    return d != null && !d.isBefore(start) && !d.isAfter(end);
                })
                .collect(Collectors.toList());

        BigDecimal totalSpent = receipts.stream()
                .map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Category> catMap = getCategoryMap();
        Map<String, BigDecimal> catTotals = new HashMap<>();

        for (Receipt r : receipts) {
            String catName = r.getCategoryId() != null && catMap.containsKey(r.getCategoryId())
                    ? catMap.get(r.getCategoryId()).getName()
                    : "Uncategorized";
            BigDecimal amt = r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO;
            catTotals.put(catName, catTotals.getOrDefault(catName, BigDecimal.ZERO).add(amt));
        }

        List<Map.Entry<String, BigDecimal>> sorted = catTotals.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .collect(Collectors.toList());

        StringBuilder answer = new StringBuilder();
        if (sorted.isEmpty()) {
            answer.append("You have no expenses recorded for the current month.");
        } else {
            Map.Entry<String, BigDecimal> top = sorted.get(0);
            double pct = totalSpent.compareTo(BigDecimal.ZERO) > 0
                    ? (top.getValue().doubleValue() / totalSpent.doubleValue()) * 100.0
                    : 0.0;

            answer.append("This month, you spent a total of ₹").append(totalSpent.setScale(2, RoundingMode.HALF_UP))
                    .append(". Your largest expense category was ").append(top.getKey())
                    .append(" (₹").append(top.getValue().setScale(2, RoundingMode.HALF_UP))
                    .append(", ").append(String.format("%.1f", pct)).append("% of total spending).");
        }

        return new AskQueryResponse(rawQuery, answer.toString(), totalSpent, receipts.size(), mapReceiptsToDto(receipts.stream().limit(10).toList(), catMap));
    }

    private AskQueryResponse handleMoMComparisonIntent(String userId, String rawQuery) {
        LocalDate curStart = LocalDate.now().withDayOfMonth(1);
        LocalDate curEnd = LocalDate.now();

        LocalDate prevStart = LocalDate.now().minusMonths(1).withDayOfMonth(1);
        LocalDate prevEnd = LocalDate.now().minusMonths(1).withDayOfMonth(LocalDate.now().minusMonths(1).lengthOfMonth());

        BigDecimal curTotal = receiptRepository.sumTotalByUserIdAndDateRange(userId, curStart, curEnd);
        BigDecimal prevTotal = receiptRepository.sumTotalByUserIdAndDateRange(userId, prevStart, prevEnd);

        if (curTotal == null) curTotal = BigDecimal.ZERO;
        if (prevTotal == null) prevTotal = BigDecimal.ZERO;

        BigDecimal diff = curTotal.subtract(prevTotal);
        double momPct = prevTotal.compareTo(BigDecimal.ZERO) > 0
                ? (diff.doubleValue() / prevTotal.doubleValue()) * 100.0
                : 0.0;

        StringBuilder answer = new StringBuilder();
        answer.append("Your current month spending is ₹").append(curTotal.setScale(2, RoundingMode.HALF_UP))
                .append(" compared to ₹").append(prevTotal.setScale(2, RoundingMode.HALF_UP))
                .append(" last month. ");

        if (diff.compareTo(BigDecimal.ZERO) > 0) {
            answer.append("Spending increased by ₹").append(diff.setScale(2, RoundingMode.HALF_UP))
                    .append(" (+").append(String.format("%.1f", momPct)).append("%).");
        } else if (diff.compareTo(BigDecimal.ZERO) < 0) {
            answer.append("Spending decreased by ₹").append(diff.abs().setScale(2, RoundingMode.HALF_UP))
                    .append(" (-").append(String.format("%.1f", Math.abs(momPct))).append("%).");
        } else {
            answer.append("Your spending is unchanged compared to last month.");
        }

        List<Receipt> curReceipts = receiptRepository.findByUserId(userId).stream()
                .filter(r -> {
                    LocalDate d = r.getReceiptDate() != null ? r.getReceiptDate() : (r.getCreatedAt() != null ? r.getCreatedAt().toLocalDate() : null);
                    return d != null && !d.isBefore(curStart) && !d.isAfter(curEnd);
                }).collect(Collectors.toList());

        return new AskQueryResponse(rawQuery, answer.toString(), curTotal, curReceipts.size(), mapReceiptsToDto(curReceipts.stream().limit(10).toList(), getCategoryMap()));
    }

    private AskQueryResponse handleTopVendorsIntent(String userId, String rawQuery) {
        List<Object[]> rows = receiptRepository.aggregateVendorStats(userId);
        if (rows.isEmpty()) {
            return new AskQueryResponse(rawQuery, "No vendor spending recorded yet.", BigDecimal.ZERO, 0, Collections.emptyList());
        }

        Object[] topRow = rows.get(0);
        String topVendor = (String) topRow[0];
        long count = ((Number) topRow[1]).longValue();
        BigDecimal totalSpent = (BigDecimal) topRow[2];

        StringBuilder answer = new StringBuilder();
        answer.append("Your top vendor by overall spend is ").append(topVendor)
                .append(" with a total of ₹").append(totalSpent.setScale(2, RoundingMode.HALF_UP))
                .append(" across ").append(count).append(" receipt").append(count > 1 ? "s" : "").append(".");

        List<Receipt> topVendorReceipts = receiptRepository.findByUserIdAndVendorName(userId, topVendor);
        return new AskQueryResponse(rawQuery, answer.toString(), totalSpent, count, mapReceiptsToDto(topVendorReceipts.stream().limit(10).toList(), getCategoryMap()));
    }

    private AskQueryResponse handleReviewQueueIntent(String userId, String rawQuery) {
        List<Receipt> all = receiptRepository.findByUserId(userId);
        List<Receipt> reviewItems = all.stream()
                .filter(r -> "NEEDS_REVIEW".equalsIgnoreCase(r.getOcrStatus()) || "FAILED".equalsIgnoreCase(r.getOcrStatus())
                        || r.getVendorName() == null || r.getVendorName().trim().isEmpty()
                        || r.getTotalAmount() == null || r.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0
                        || r.getCategoryId() == null)
                .collect(Collectors.toList());

        BigDecimal unreviewedTotal = reviewItems.stream()
                .map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        StringBuilder answer = new StringBuilder();
        if (reviewItems.isEmpty()) {
            answer.append("Great news! You have 0 unreviewed receipts in your queue. All your expenses are clean.");
        } else {
            answer.append("You have ").append(reviewItems.size()).append(" receipt").append(reviewItems.size() > 1 ? "s" : "")
                    .append(" in your review queue needing category or OCR verification, totaling ₹")
                    .append(unreviewedTotal.setScale(2, RoundingMode.HALF_UP)).append(".");
        }

        return new AskQueryResponse(rawQuery, answer.toString(), unreviewedTotal, reviewItems.size(), mapReceiptsToDto(reviewItems.stream().limit(10).toList(), getCategoryMap()));
    }

    private AskQueryResponse handleLargestExpensesIntent(String userId, String rawQuery) {
        List<Receipt> receipts = receiptRepository.findByUserId(userId).stream()
                .filter(r -> r.getTotalAmount() != null)
                .sorted(Comparator.comparing(Receipt::getTotalAmount).reversed())
                .collect(Collectors.toList());

        if (receipts.isEmpty()) {
            return new AskQueryResponse(rawQuery, "No receipts with valid amounts found.", BigDecimal.ZERO, 0, Collections.emptyList());
        }

        Receipt largest = receipts.get(0);
        BigDecimal totalSpent = receipts.stream().map(Receipt::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        StringBuilder answer = new StringBuilder();
        answer.append("Your largest single expense is ₹").append(largest.getTotalAmount().setScale(2, RoundingMode.HALF_UP))
                .append(" at ").append(largest.getVendorName() != null ? largest.getVendorName() : "Unknown Vendor")
                .append(" on ").append(largest.getReceiptDate() != null ? largest.getReceiptDate().toString() : "unspecified date").append(".");

        return new AskQueryResponse(rawQuery, answer.toString(), totalSpent, receipts.size(), mapReceiptsToDto(receipts.stream().limit(10).toList(), getCategoryMap()));
    }

    private AskQueryResponse handleStandardSpendingSearch(String userId, String rawQuery, String query) {
        Map<String, Category> categoryMap = getCategoryMap();

        // 1. Determine Date Range
        LocalDate startDate = null;
        LocalDate endDate = LocalDate.now();

        if (query.contains("last 12 months") || query.contains("past 12 months") || query.contains("12 months")) {
            startDate = LocalDate.now().minusMonths(12).withDayOfMonth(1);
        } else if (query.contains("last 6 months") || query.contains("past 6 months") || query.contains("6 months")) {
            startDate = LocalDate.now().minusMonths(6).withDayOfMonth(1);
        } else if (query.contains("last 3 months") || query.contains("past 3 months") || query.contains("3 months")) {
            startDate = LocalDate.now().minusMonths(3).withDayOfMonth(1);
        } else if (query.contains("last month") || query.contains("previous month") || query.contains("past month")) {
            startDate = LocalDate.now().minusMonths(1).withDayOfMonth(1);
            endDate = LocalDate.now().minusMonths(1).withDayOfMonth(LocalDate.now().minusMonths(1).lengthOfMonth());
        } else if (query.contains("this month") || query.contains("current month") || query.contains("present month")) {
            startDate = LocalDate.now().withDayOfMonth(1);
        } else if (query.contains("this year") || query.contains("current year")) {
            startDate = LocalDate.now().withDayOfYear(1);
        } else if (query.contains("last year") || query.contains("previous year")) {
            startDate = LocalDate.now().minusYears(1).withDayOfYear(1);
            endDate = LocalDate.now().minusYears(1).withDayOfYear(LocalDate.now().minusYears(1).lengthOfYear());
        } else if (query.contains("today")) {
            startDate = LocalDate.now();
        } else if (query.contains("yesterday")) {
            startDate = LocalDate.now().minusDays(1);
            endDate = LocalDate.now().minusDays(1);
        }

        // 2. Determine Min / Max Amount (supporting commas in input like ₹5,000)
        BigDecimal minAmount = null;
        BigDecimal maxAmount = null;

        Pattern abovePattern = Pattern.compile("(above|greater than|over|>|more than|exceeding|higher than)\\s*(?:rs\\.?|₹)?\\s*(\\d+(?:\\.\\d+)?)");
        Matcher aboveMatcher = abovePattern.matcher(query);
        if (aboveMatcher.find()) {
            try {
                minAmount = new BigDecimal(aboveMatcher.group(2));
            } catch (Exception ignored) {}
        }

        Pattern belowPattern = Pattern.compile("(below|less than|under|<|lower than)\\s*(?:rs\\.?|₹)?\\s*(\\d+(?:\\.\\d+)?)");
        Matcher belowMatcher = belowPattern.matcher(query);
        if (belowMatcher.find()) {
            try {
                maxAmount = new BigDecimal(belowMatcher.group(2));
            } catch (Exception ignored) {}
        }

        // 3. Resolve Category ID if query matches category names/synonyms
        String matchedCategoryId = null;
        String matchedCategoryName = null;

        for (Category cat : categoryMap.values()) {
            String nameLower = cat.getName().toLowerCase();
            if (query.contains(nameLower)) {
                matchedCategoryId = cat.getId();
                matchedCategoryName = cat.getName();
                break;
            }
        }

        // Synonym Fallbacks
        if (matchedCategoryId == null) {
            if (query.contains("travel") || query.contains("cab") || query.contains("flight") || query.contains("hotel") || query.contains("uber") || query.contains("ola") || query.contains("petrol") || query.contains("fuel")) {
                matchedCategoryId = findCategoryIdByName(categoryMap, "Travel");
                matchedCategoryName = "Travel";
            } else if (query.contains("food") || query.contains("dining") || query.contains("swiggy") || query.contains("zomato") || query.contains("restaurant") || query.contains("cafe") || query.contains("meal") || query.contains("lunch")) {
                matchedCategoryId = findCategoryIdByName(categoryMap, "Food");
                matchedCategoryName = "Food & Dining";
            } else if (query.contains("software") || query.contains("tool") || query.contains("aws") || query.contains("github") || query.contains("chatgpt") || query.contains("cloud") || query.contains("saas")) {
                matchedCategoryId = findCategoryIdByName(categoryMap, "Software");
                matchedCategoryName = "Software & Tools";
            } else if (query.contains("internet") || query.contains("wifi") || query.contains("phone") || query.contains("broadband") || query.contains("mobile")) {
                matchedCategoryId = findCategoryIdByName(categoryMap, "Internet");
                matchedCategoryName = "Internet & Phone";
            } else if (query.contains("office") || query.contains("stationery") || query.contains("supplies")) {
                matchedCategoryId = findCategoryIdByName(categoryMap, "Office");
                matchedCategoryName = "Office Supplies";
            } else if (query.contains("utility") || query.contains("utilities") || query.contains("electricity")) {
                matchedCategoryId = findCategoryIdByName(categoryMap, "Utilities");
                matchedCategoryName = "Utilities";
            } else if (query.contains("marketing") || query.contains("ads") || query.contains("facebook") || query.contains("google ads")) {
                matchedCategoryId = findCategoryIdByName(categoryMap, "Marketing");
                matchedCategoryName = "Marketing & Ads";
            } else if (query.contains("equipment") || query.contains("hardware") || query.contains("laptop") || query.contains("apple")) {
                matchedCategoryId = findCategoryIdByName(categoryMap, "Equipment");
                matchedCategoryName = "Equipment & Hardware";
            }
        }

        // 4. Business vs Personal
        Boolean isBusiness = null;
        if (query.contains("business")) isBusiness = true;
        else if (query.contains("personal")) isBusiness = false;

        // 5. Clean search string for vendor/text matching (Stripping ALL spending words, verbs, and question words)
        String cleanedSearch = query.replaceAll("(?i)\\b(how|much|did|i|spend|spent|spending|spends|total|totals|sum|summary|overall|amount|amounts|cost|costs|price|prices|value|val|pay|paid|payment|payments|money|expenses|expense|receipt|receipts|bill|bills|record|records|transaction|transactions|show|list|find|get|give|tell|display|fetch|search|what|where|which|when|me|my|all|any|in|on|for|at|by|from|to|with|within|the|a|an|of|and|or|last|past|this|current|present|previous|next|recent|month|months|year|years|day|days|week|weeks|q1|q2|q3|q4|quarter|above|over|below|under|greater|than|less|more|exceeding|higher|lower|min|max|rs|rupees|inr|pending|review|needed|attention|queue|flagged|uncategorized|category|is|was|are|were|have|has|had)\\b", " ")
                .replaceAll("[₹,]", " ")
                .replaceAll("\\s+", " ").trim();

        if (cleanedSearch.length() <= 2 || (matchedCategoryName != null && cleanedSearch.equalsIgnoreCase(matchedCategoryName))) {
            cleanedSearch = null;
        }

        // Fetch User's Receipts
        List<Receipt> userReceipts = receiptRepository.findByUserId(userId);

        final LocalDate finalStart = startDate;
        final LocalDate finalEnd = endDate;
        final BigDecimal finalMin = minAmount;
        final BigDecimal finalMax = maxAmount;
        final String finalCatId = matchedCategoryId;
        final Boolean finalBiz = isBusiness;
        final String finalSearch = cleanedSearch;

        List<Receipt> filtered = userReceipts.stream().filter(r -> {
            LocalDate rDate = r.getReceiptDate() != null ? r.getReceiptDate() : (r.getCreatedAt() != null ? r.getCreatedAt().toLocalDate() : null);

            if (finalStart != null && (rDate == null || rDate.isBefore(finalStart))) return false;
            if (finalEnd != null && (rDate == null || rDate.isAfter(finalEnd))) return false;
            if (finalMin != null && (r.getTotalAmount() == null || r.getTotalAmount().compareTo(finalMin) < 0)) return false;
            if (finalMax != null && (r.getTotalAmount() == null || r.getTotalAmount().compareTo(finalMax) > 0)) return false;
            if (finalBiz != null && r.isBusiness() != finalBiz) return false;
            if (finalCatId != null && !finalCatId.equals(r.getCategoryId())) return false;
            if (finalSearch != null) {
                String searchKey = finalSearch.toLowerCase();
                boolean vendorMatch = r.getVendorName() != null && r.getVendorName().toLowerCase().contains(searchKey);
                boolean textMatch = r.getOcrRawText() != null && r.getOcrRawText().toLowerCase().contains(searchKey);
                if (!vendorMatch && !textMatch) return false;
            }
            return true;
        }).collect(Collectors.toList());

        BigDecimal calculatedTotal = filtered.stream()
                .map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long receiptCount = filtered.size();

        StringBuilder answerBuilder = new StringBuilder();
        if (receiptCount == 0) {
            if (userReceipts.isEmpty()) {
                answerBuilder.append("You haven't uploaded or saved any receipts yet. Scan or upload your receipts to see detailed financial insights.");
            } else {
                answerBuilder.append("No receipts found matching your query");
                if (matchedCategoryName != null) answerBuilder.append(" in category '").append(matchedCategoryName).append("'");
                if (cleanedSearch != null) answerBuilder.append(" matching '").append(cleanedSearch).append("'");
                if (minAmount != null) answerBuilder.append(" above ₹").append(minAmount);
                if (startDate != null) answerBuilder.append(" for the selected time period");
                answerBuilder.append(".");
            }
        } else {
            answerBuilder.append("You spent ₹").append(calculatedTotal.setScale(2, RoundingMode.HALF_UP))
                    .append(" across ").append(receiptCount).append(" receipt").append(receiptCount > 1 ? "s" : "");
            if (matchedCategoryName != null) {
                answerBuilder.append(" in '").append(matchedCategoryName).append("'");
            } else if (cleanedSearch != null) {
                answerBuilder.append(" for '").append(cleanedSearch).append("'");
            }
            if (minAmount != null) {
                answerBuilder.append(" (above ₹").append(minAmount).append(")");
            }
            if (startDate != null) {
                answerBuilder.append(" from ").append(startDate.format(DateTimeFormatter.ofPattern("MMM d, yyyy")));
                if (endDate != null) {
                    answerBuilder.append(" to ").append(endDate.format(DateTimeFormatter.ofPattern("MMM d, yyyy")));
                }
            }
            answerBuilder.append(".");
        }

        return new AskQueryResponse(rawQuery, answerBuilder.toString(), calculatedTotal, receiptCount, mapReceiptsToDto(filtered.stream().limit(10).toList(), categoryMap));
    }

    private String findCategoryIdByName(Map<String, Category> categoryMap, String partialName) {
        String key = partialName.toLowerCase();
        for (Category cat : categoryMap.values()) {
            if (cat.getName().toLowerCase().contains(key)) {
                return cat.getId();
            }
        }
        return null;
    }

    private List<ReceiptDto> mapReceiptsToDto(List<Receipt> receipts, Map<String, Category> categoryMap) {
        return receipts.stream().map(r -> {
            Category cat = r.getCategoryId() != null ? categoryMap.get(r.getCategoryId()) : null;
            String catName = cat != null ? cat.getName() : "Uncategorized";
            String catColor = cat != null ? cat.getColor() : "#64748B";
            String fileUrl = storageService.getFileUrl(r.getFileKey());
            return ReceiptDto.fromEntity(r, catName, catColor, fileUrl);
        }).collect(Collectors.toList());
    }

    private Map<String, Category> getCategoryMap() {
        return categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getId, c -> c, (a, b) -> a));
    }
}
