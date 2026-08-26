package com.track3.alkywall.dtos;

import java.math.BigDecimal;

public class TransactionCreateDTO {
    private BigDecimal amount;
    private String type; // ej: INGRESO o EGRESO
    private String description;
    private Long categoryId;
    private Long accountId;

    public TransactionCreateDTO() {}

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }
}
