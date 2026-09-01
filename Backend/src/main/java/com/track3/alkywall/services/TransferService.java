package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.InvalidTransferException;
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
    public void createTransfer(String emailUserAuthenticated, String sourceAccountNumber, String destinationAccount, BigDecimal amount, String description) {
        log.info("Creando transferencia de cuentaOrigen={} a cuentaDestino={}", sourceAccountNumber, destinationAccount);

        if(sourceAccountNumber.equals(destinationAccount)){
            log.error("Transferencia a misma cuenta");
            throw new InvalidTransferException("No se puede transferir a la misma cuenta");
        }

        if(!accountService.accountExistsByAccountNumberAndEmail(sourceAccountNumber, emailUserAuthenticated)){
            log.error("Transferencia desde número de cuenta no asociado al usuario");
            throw new InvalidTransferException("El número de cuenta origen no está asociado con el usuario");
        }

        Transaction sourceTransaction = transactionService.createTransaction(sourceAccountNumber, amount, "DEBIT", description, "TRANSFER");

        Transaction destinationTransaction = transactionService.createTransaction(destinationAccount, amount, "CREDIT", description, "TRANSFER");

        transferRepository.save(new Transfer(sourceTransaction, destinationTransaction));
    }
}
