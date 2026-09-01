package com.track3.alkywall.controllers.models;

import java.math.BigDecimal;

public record AccountDTO(
    BigDecimal balance,
    String currency,
    String alias,
    Boolean isActive
) {
}
