package com.track3.alkywall.controllers.models;

import com.track3.alkywall.models.Account;
import com.track3.alkywall.models.Transfer;

import java.math.BigDecimal;

public record TransferResponse(
        BigDecimal amount,
        String sourceFirstName,
        String sourceLastName,
        String sourceAccountNumber,
        String destinationFirstName,
        String destinationLastName,
        String destinationAccountNumber,
        String description
) {
    public static TransferResponse from(Transfer transfer) {
        Account sourceAccount = transfer.getSourceTransaction().getSourceAccount();
        Account destinationAccount = transfer.getDestinationTransaction().getSourceAccount();
        return new TransferResponse(
                transfer.getSourceTransaction().getAmount(),
                sourceAccount.getUser().getFirstName(),
                sourceAccount.getUser().getLastName(),
                sourceAccount.getAccountNumber(),
                destinationAccount.getUser().getFirstName(),
                destinationAccount.getUser().getLastName(),
                destinationAccount.getAccountNumber(),
                transfer.getSourceTransaction().getDescription()
        );
    }
}
