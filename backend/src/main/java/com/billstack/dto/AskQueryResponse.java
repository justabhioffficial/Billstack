package com.billstack.dto;

import java.math.BigDecimal;
import java.util.List;

public class AskQueryResponse {

    private String originalQuery;
    private String answerText;
    private BigDecimal calculatedTotal;
    private long receiptCount;
    private List<ReceiptDto> relevantReceipts;

    public AskQueryResponse() {}

    public AskQueryResponse(String originalQuery, String answerText, BigDecimal calculatedTotal, long receiptCount, List<ReceiptDto> relevantReceipts) {
        this.originalQuery = originalQuery;
        this.answerText = answerText;
        this.calculatedTotal = calculatedTotal;
        this.receiptCount = receiptCount;
        this.relevantReceipts = relevantReceipts;
    }

    public String getOriginalQuery() { return originalQuery; }
    public void setOriginalQuery(String originalQuery) { this.originalQuery = originalQuery; }

    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }

    public BigDecimal getCalculatedTotal() { return calculatedTotal; }
    public void setCalculatedTotal(BigDecimal calculatedTotal) { this.calculatedTotal = calculatedTotal; }

    public long getReceiptCount() { return receiptCount; }
    public void setReceiptCount(long receiptCount) { this.receiptCount = receiptCount; }

    public List<ReceiptDto> getRelevantReceipts() { return relevantReceipts; }
    public void setRelevantReceipts(List<ReceiptDto> relevantReceipts) { this.relevantReceipts = relevantReceipts; }
}
