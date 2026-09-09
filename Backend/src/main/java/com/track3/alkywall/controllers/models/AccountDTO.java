package com.track3.alkywall.controllers.models;

import com.track3.alkywall.models.Account;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AccountDTO(
        String accountNumber,
        BigDecimal balance,
        String currency,
        String alias,
        Boolean isActive,
        LocalDateTime createdAt
) {
    public static AccountDTO from(Account account){
        return new AccountDTO(
                account.getAccountNumber(),
                account.getBalance(),
                account.getCurrency(),
                account.getAlias(),
                account.getIsActive(),
                account.getCreatedAt()
        );
    }
}
