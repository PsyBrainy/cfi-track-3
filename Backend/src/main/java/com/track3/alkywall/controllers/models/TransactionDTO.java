package com.track3.alkywall.controllers.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionDTO (
        BigDecimal amount,
        String type,
        String category_name,
        String description,
        LocalDateTime createdAt
){}
