package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.AccountNotOwnedByUserException;
import com.track3.alkywall.config.exceptions.InvalidTransferException;
import com.track3.alkywall.config.exceptions.NotFoundException;
import com.track3.alkywall.controllers.models.TopDestinationContactResponse;
import com.track3.alkywall.models.Account;
import com.track3.alkywall.models.Transaction;
import com.track3.alkywall.models.Transfer;
import com.track3.alkywall.models.User;
import com.track3.alkywall.repositories.TransferRepository;
import com.track3.alkywall.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TransferService {
    private final TransferRepository transferRepository;
    private final TransactionService transactionService;
    private final AccountService accountService;
    private final UserRepository userRepository;

    public TransferService(TransferRepository transferRepository, TransactionService transactionService, AccountService accountService, UserRepository userRepository) {
        this.transferRepository = transferRepository;
        this.transactionService = transactionService;
        this.accountService = accountService;
        this.userRepository = userRepository;
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

    @Transactional(readOnly = true)
    public List<Transfer> getTransfersSentByUser(String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new NotFoundException("Usuario autenticado no encontrado"));

        return transferRepository.findBySourceTransaction_SourceAccount_User_Id(currentUser.getId());
    }

    @Transactional(readOnly = true)
    public List<TopDestinationContactResponse> getTopDestinationContacts(String currentUserEmail) {
        List<Transfer> transfers = getTransfersSentByUser(currentUserEmail);

        Map<DestinationContact, List<Transfer>> transfersByContact = transfers.stream()
                .collect(Collectors.groupingBy(DestinationContact::from));

        return transfersByContact.entrySet().stream()
                .sorted(Map.Entry.<DestinationContact, List<Transfer>>comparingByValue(Comparator.comparingInt(List::size)).reversed())
                .limit(3)
                .map(entry -> {
                    DestinationContact contact = entry.getKey();
                    List<Transfer> contactTransfers = entry.getValue();
                    BigDecimal lastTransferAmount = contactTransfers.stream()
                            .max(Comparator.comparing(t -> t.getSourceTransaction().getCreatedAt()))
                            .map(t -> t.getSourceTransaction().getAmount())
                            .orElse(null);

                    return new TopDestinationContactResponse(
                            contact.firstName(),
                            contact.lastName(),
                            contact.accountNumber(),
                            contact.alias(),
                            (long) contactTransfers.size(),
                            lastTransferAmount
                    );
                })
                .toList();
    }

    private record DestinationContact(String firstName, String lastName, String accountNumber, String alias) {
        static DestinationContact from(Transfer transfer) {
            Account destinationAccount = transfer.getDestinationTransaction().getSourceAccount();
            User destinationUser = destinationAccount.getUser();
            return new DestinationContact(destinationUser.getFirstName(), destinationUser.getLastName(), destinationAccount.getAccountNumber(), destinationAccount.getAlias());
        }
    }
}
