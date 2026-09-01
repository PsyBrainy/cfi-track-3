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
    private Long id;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String description;

    @ManyToOne(optional = false)
    @JoinColumn(name = "source_account_id", nullable = false)
    private Account sourceAccount;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

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
