package com.track3.alkywall.services;

import com.track3.alkywall.controllers.models.AccountDTO;
import com.track3.alkywall.controllers.models.TransactionDTO;
import com.track3.alkywall.models.Account;
import com.track3.alkywall.models.Category;
import com.track3.alkywall.models.Transaction;
import com.track3.alkywall.repositories.AccountRepository;
import com.track3.alkywall.repositories.CategoryRepository;
import com.track3.alkywall.repositories.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class TransactionService {
    TransactionRepository transactionRepository;
    AccountRepository accountRepository;
    CategoryRepository categoryRepository;
    public TransactionService(TransactionRepository transactionRepository, AccountRepository accountRepository, CategoryRepository categoryRepository){
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public TransactionDTO realizarDeposito(Account account, BigDecimal amount){
        account.setSaldo(account.getSaldo().add(amount));
        Optional<Category> categoryOptional = categoryRepository.findByName("Deposito");
        Category category = categoryOptional.orElseGet(() -> categoryRepository.save(new Category("Deposito")));
        accountRepository.updateSaldoById(account.getId(), account.getSaldo());
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
}
