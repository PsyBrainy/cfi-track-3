package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.InsufficientFundsException;
import com.track3.alkywall.config.exceptions.NotFoundException;
import com.track3.alkywall.controllers.models.TransactionDTO;
import com.track3.alkywall.models.Account;
import com.track3.alkywall.models.Category;
import com.track3.alkywall.models.Transaction;
import com.track3.alkywall.repositories.CategoryRepository;
import com.track3.alkywall.repositories.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Slf4j
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountService accountService;
    private final CategoryRepository categoryRepository;

    public TransactionService(TransactionRepository transactionRepository, AccountService accountService, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public TransactionDTO realizarDeposito(Account account, BigDecimal amount){
        account.setBalance(account.getBalance().add(amount));
        Category category = categoryRepository.findByName("DEPOSIT").orElseThrow(() -> new NotFoundException("Categoría no encontrada"));
        accountService.updateAccountBalance(account.getId(), account.getBalance());
        return toDTO(transactionRepository.save(new Transaction(
                amount,
                "CREDIT",
                "COMPLETED",
                "",
                account,
                category
        )));
    }

    private static TransactionDTO toDTO(Transaction transaction){
        return new TransactionDTO(
                transaction.getAmount(),
                transaction.getType(),
                transaction.getCategory().getName(),
                transaction.getDescription(),
                transaction.getCreatedAt()
        );
    }

    @Transactional
    public Transaction createTransaction(Account account, BigDecimal amount, String type, String description, String categoryName) throws InsufficientFundsException {
        log.info("Creando transacción de cuenta={}", account.getAccountNumber());

        if(type.equals("DEBIT")){
            if(account.getBalance().compareTo(amount) < 0){
                log.error("Saldo insuficiente. Saldo={}, monto={}", account.getBalance(), amount);
                throw new InsufficientFundsException("Saldo insuficiente");
            }

            account.setBalance(account.getBalance().subtract(amount));
        }else{
            account.setBalance(account.getBalance().add(amount));
        }

        Category category = categoryRepository.findByName(categoryName).orElseThrow(
                () -> {
                    log.error("Categoría={} no encontrada", categoryName);
                    return new NotFoundException("La categoría no existe");
                }
        );

        return transactionRepository.save(new Transaction(amount, type, "COMPLETED", description, account, category));
    }
}
