package com.billstack.dto;

import java.math.BigDecimal;
import java.util.List;

public class AskQueryRequest {
    private String query;

    public AskQueryRequest() {}
    public AskQueryRequest(String query) { this.query = query; }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
}
