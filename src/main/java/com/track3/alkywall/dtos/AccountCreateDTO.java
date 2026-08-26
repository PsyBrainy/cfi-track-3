package com.track3.alkywall.dtos;

public class AccountCreateDTO {
    private Long userId;
    private String currency; // ej: ARS o USD

    public AccountCreateDTO() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
