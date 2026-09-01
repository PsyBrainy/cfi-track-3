package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.InsufficientFundsException;
import com.track3.alkywall.config.exceptions.NotFoundException;
import com.track3.alkywall.controllers.models.TransactionDTO;
import com.track3.alkywall.models.Account;
import com.track3.alkywall.models.Category;
import com.track3.alkywall.models.Transaction;
import com.track3.alkywall.repositories.AccountRepository;
import com.track3.alkywall.repositories.CategoryRepository;
import com.track3.alkywall.repositories.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@Slf4j
public class TransactionService {
    TransactionRepository transactionRepository;
    AccountRepository accountRepository;
    CategoryRepository categoryRepository;

    public TransactionService(TransactionRepository transactionRepository, AccountRepository accountRepository, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public TransactionDTO realizarDeposito(Account account, BigDecimal amount){
        account.setBalance(account.getBalance().add(amount));
        Optional<Category> categoryOptional = categoryRepository.findByName("Deposito");
        Category category = categoryOptional.orElseGet(() -> categoryRepository.save(new Category("Deposito")));
        accountRepository.updateBalanceById(account.getId(), account.getBalance());
        return toDTO(transactionRepository.save(new Transaction(
                amount,
                "Depósito",
                "Completada",
                "",
                account,
                category
        )),
                category.getName());
    }

    private static TransactionDTO toDTO(Transaction transaction, String categoryName){
        return new TransactionDTO(
                transaction.getAmount(),
                transaction.getType(),
                categoryName,
                transaction.getDescription(),
                transaction.getCreatedAt()
        );
    }

    @Transactional
    public Transaction createTransaction(String accountIdentifier, BigDecimal amount, String type, String description, String categoryName) throws InsufficientFundsException {
        log.info("Creando transacción de cuenta={}", accountIdentifier);
        Account account = accountRepository.findByAccountNumberOrAlias(accountIdentifier).orElseThrow(
                () -> {
                    log.error("Cuenta={} no encontrada", accountIdentifier);
                    return new NotFoundException("La cuenta no existe");
                }
        );

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
