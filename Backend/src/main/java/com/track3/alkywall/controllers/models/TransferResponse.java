package com.track3.alkywall.controllers.models;

import com.track3.alkywall.models.Account;
import com.track3.alkywall.models.Transfer;

public record TransferResponse(
        String relatedAccountFirstName,
        String relatedAccountLastName,
        String relatedAccountNumber,
        String description
) {
    public static TransferResponse from(Transfer sourceTransfer) {
        Account relatedAccount = sourceTransfer.getType().equals("DEBIT") ? sourceTransfer.getRelatedAccount() : sourceTransfer.getAccount();

        return new TransferResponse(
                relatedAccount.getUser().getFirstName(),
                relatedAccount.getUser().getLastName(),
                relatedAccount.getAccountNumber(),
                sourceTransfer.getDescription()
        );
    }
}
