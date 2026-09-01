package com.track3.alkywall.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "transfers")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Transfer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "source_transaction_id")
    private Transaction sourceTransaction;

    @OneToOne(optional = false)
    @JoinColumn(name = "destination_transaction_id")
    private Transaction destinationTransaction;

    public Transfer(Transaction sourceTransaction, Transaction destinationTransaction) {
        this.sourceTransaction = sourceTransaction;
        this.destinationTransaction = destinationTransaction;
    }
}
