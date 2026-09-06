package com.billstack.service;

import com.billstack.dto.CategoryBreakdownDto;
import com.billstack.dto.MonthlyReportDto;
import com.billstack.dto.SpendingTrendDto;
import com.billstack.dto.VendorBreakdownDto;
import com.billstack.entity.Category;
import com.billstack.repository.CategoryRepository;
import com.billstack.repository.ReceiptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReceiptRepository receiptRepository;
    private final CategoryRepository categoryRepository;

    public ReportService(ReceiptRepository receiptRepository, CategoryRepository categoryRepository) {
        this.receiptRepository = receiptRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public MonthlyReportDto getMonthlyReport(String userId, String yearMonthStr) {
        YearMonth ym = yearMonthStr != null ? YearMonth.parse(yearMonthStr) : YearMonth.now();
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        BigDecimal total = receiptRepository.sumTotalByUserIdAndDateRange(userId, startDate, endDate);
        BigDecimal business = receiptRepository.sumBusinessByUserIdAndDateRange(userId, startDate, endDate);
        BigDecimal personal = receiptRepository.sumPersonalByUserIdAndDateRange(userId, startDate, endDate);

        MonthlyReportDto report = new MonthlyReportDto();
        report.setYearMonth(ym.toString());
        report.setTotalExpenses(total);
        report.setBusinessExpenses(business);
        report.setPersonalExpenses(personal);

        // Category Breakdown
        List<Object[]> rawCatData = receiptRepository.aggregateByCategory(userId, startDate, endDate);
        Map<String, Category> categoryMap = categoryRepository.findAllAvailableForUser(userId).stream()
                .collect(Collectors.toMap(Category::getId, Function.identity(), (a, b) -> a));

        List<CategoryBreakdownDto> catBreakdown = new ArrayList<>();
        String topCatName = "None";
        BigDecimal maxCatAmount = BigDecimal.ZERO;

        for (Object[] row : rawCatData) {
            String catId = (String) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            long count = (Long) row[2];

            Category cat = categoryMap.get(catId);
            String catName = cat != null ? cat.getName() : "Uncategorized";
            String color = cat != null ? cat.getColor() : "#64748B";

            double percentage = total.compareTo(BigDecimal.ZERO) > 0
                    ? amount.divide(total, 4, RoundingMode.HALF_UP).doubleValue() * 100
                    : 0.0;

            if (amount.compareTo(maxCatAmount) > 0) {
                maxCatAmount = amount;
                topCatName = catName;
            }

            catBreakdown.add(new CategoryBreakdownDto(catId, catName, color, amount, count, Math.round(percentage * 10.0) / 10.0));
        }

        report.setCategoryBreakdown(catBreakdown);
        report.setTopCategoryName(topCatName);

        // Vendor Breakdown
        List<Object[]> rawVendorData = receiptRepository.aggregateByVendor(userId, startDate, endDate);
        List<VendorBreakdownDto> vendorBreakdown = new ArrayList<>();
        for (Object[] row : rawVendorData) {
            String vName = (String) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            long count = (Long) row[2];
            vendorBreakdown.add(new VendorBreakdownDto(vName != null ? vName : "Unknown Vendor", amount, count));
        }
        report.setVendorBreakdown(vendorBreakdown);

        // 6-Month Trend Data
        List<SpendingTrendDto> trendList = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth tYm = ym.minusMonths(i);
            LocalDate tStart = tYm.atDay(1);
            LocalDate tEnd = tYm.atEndOfMonth();

            BigDecimal tTotal = receiptRepository.sumTotalByUserIdAndDateRange(userId, tStart, tEnd);
            BigDecimal tBiz = receiptRepository.sumBusinessByUserIdAndDateRange(userId, tStart, tEnd);
            BigDecimal tPers = receiptRepository.sumPersonalByUserIdAndDateRange(userId, tStart, tEnd);

            trendList.add(new SpendingTrendDto(tYm.format(DateTimeFormatter.ofPattern("MMM yyyy")), tTotal, tBiz, tPers));
        }
        report.setMonthlyTrend(trendList);

        return report;
    }
}
