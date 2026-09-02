package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.AccountNotOwnedByUserException;
import com.track3.alkywall.config.exceptions.InvalidTransferException;
import com.track3.alkywall.models.Account;
import com.track3.alkywall.models.Transaction;
import com.track3.alkywall.models.Transfer;
import com.track3.alkywall.repositories.TransferRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Slf4j
public class TransferService {
    private final TransferRepository transferRepository;
    private final TransactionService transactionService;
    private final AccountService accountService;

    public TransferService(TransferRepository transferRepository, TransactionService transactionService,  AccountService accountService) {
        this.transferRepository = transferRepository;
        this.transactionService = transactionService;
        this.accountService = accountService;
    }

    @Transactional
    public Transfer createTransfer(String emailUserAuthenticated, String sourceAccountNumber, String destinationAccountIdentifier, BigDecimal amount, String description) {
        log.info("Creando transferencia de cuentaOrigen={} a cuentaDestino={}", sourceAccountNumber, destinationAccountIdentifier);

        Account sourceAccount = accountService.getAccountByAccountNumberOrAlias(sourceAccountNumber);

        if(!sourceAccount.getUser().getEmail().equals(emailUserAuthenticated)) {
            log.error("Número de cuenta={} no asociado al usuario={}", sourceAccountNumber, emailUserAuthenticated);
            throw new AccountNotOwnedByUserException("El número de cuenta no está asociado con el usuario");
        }

        Account destinationAccount  = accountService.getAccountByAccountNumberOrAlias(destinationAccountIdentifier);

        if(sourceAccount.getId().equals(destinationAccount.getId())) {
            log.error("Transferencia a misma cuenta");
            throw new InvalidTransferException("No se puede transferir a la misma cuenta");
        }

        Transaction sourceTransaction = transactionService.createTransaction(sourceAccount, amount, "DEBIT", description, "TRANSFER");

        Transaction destinationTransaction = transactionService.createTransaction(destinationAccount, amount, "CREDIT", description, "TRANSFER");

        return transferRepository.save(new Transfer(sourceTransaction, destinationTransaction));
    }
}
