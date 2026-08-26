package com.track3.alkywall.services;

import com.track3.alkywall.dtos.TransactionCreateDTO;
import com.track3.alkywall.dtos.TransactionResponseDTO;
import com.track3.alkywall.models.Account;
import com.track3.alkywall.models.Category;
import com.track3.alkywall.models.Transaction;
import com.track3.alkywall.repositories.AccountRepository;
import com.track3.alkywall.repositories.CategoryRepository;
import com.track3.alkywall.repositories.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements ITransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository, AccountRepository accountRepository, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public TransactionResponseDTO createTransaction(TransactionCreateDTO dto) {
        Account account = accountRepository.findById(dto.getAccountId())
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));
                
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        // Validar saldo si es un EGRESO
        if ("EGRESO".equalsIgnoreCase(dto.getType())) {
            if (account.getBalance().compareTo(dto.getAmount()) < 0) {
                throw new RuntimeException("Saldo insuficiente");
            }
            account.setBalance(account.getBalance().subtract(dto.getAmount()));
        } else if ("INGRESO".equalsIgnoreCase(dto.getType())) {
            account.setBalance(account.getBalance().add(dto.getAmount()));
        } else {
            throw new RuntimeException("Tipo de transacción inválido (debe ser INGRESO o EGRESO)");
        }

        Transaction transaction = new Transaction();
        transaction.setAmount(dto.getAmount());
        transaction.setType(dto.getType());
        transaction.setDescription(dto.getDescription());
        transaction.setStatus("COMPLETED");
        transaction.setCategory(category);
        transaction.setAccount(account);

        Transaction savedTx = transactionRepository.save(transaction);
        accountRepository.save(account);

        return mapToDTO(savedTx);
    }

    @Override
    public TransactionResponseDTO getTransactionById(Long id) {
        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
        return mapToDTO(tx);
    }

    @Override
    public List<TransactionResponseDTO> getTransactionsByAccountId(Long accountId) {
        return transactionRepository.findByAccountId(accountId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private TransactionResponseDTO mapToDTO(Transaction tx) {
        TransactionResponseDTO dto = new TransactionResponseDTO();
        dto.setId(tx.getId());
        dto.setAmount(tx.getAmount());
        dto.setType(tx.getType());
        dto.setStatus(tx.getStatus());
        dto.setDescription(tx.getDescription());
        dto.setCreatedAt(tx.getCreatedAt());
        dto.setCategoryName(tx.getCategory().getName());
        dto.setAccountId(tx.getAccount().getId());
        return dto;
    }
}
