package com.track3.alkywall.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "account")
@Getter
@Setter
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, unique = true)
    Long accountNumber;

    @Column(nullable = false)
    BigDecimal saldo;

    @Column(nullable = false, length = 3)
    String currency;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(nullable = false)
    LocalDateTime createdAt;

    @Column(nullable = false)
    Boolean isActive;

    @Column(nullable = false, unique = true)
    String alias;

    public Account(Long accountNumber, BigDecimal saldo, String currency, User user, String alias){
        this.accountNumber = accountNumber;
        this.saldo = saldo;
        this.currency = currency;
        this.user = user;
        this.alias = alias;
        this.createdAt = LocalDateTime.now();
        this.isActive = true;
    }
}
