package com.track3.alkywall.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Transaction")
@Getter
@NoArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    String type;

    @Column(nullable = false)
    String status;

    @Column(nullable = false)
    String description;

    @ManyToOne
    @JoinColumn(name = "source_account_id", nullable = false)
    private Account sourceAccount;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    Category category;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Transaction(BigDecimal amount, String type, String status, String description, Account sourceAccount, Category category) {
        this.amount = amount;
        this.type = type;
        this.status = status;
        this.description = description;
        this.sourceAccount = sourceAccount;
        this.category = category;
        this.createdAt = LocalDateTime.now();
    }
}
