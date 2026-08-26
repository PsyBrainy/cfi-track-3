package com.track3.alkywall.models;

import jakarta.persistence.*;

@Entity
@Table(name = "transfers")
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transfer_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_account_id", nullable = false)
    private Account recipientAccount;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    public Transfer() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Account getRecipientAccount() { return recipientAccount; }
    public void setRecipientAccount(Account recipientAccount) { this.recipientAccount = recipientAccount; }
    public Transaction getTransaction() { return transaction; }
    public void setTransaction(Transaction transaction) { this.transaction = transaction; }
}
