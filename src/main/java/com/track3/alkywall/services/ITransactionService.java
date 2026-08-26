package com.track3.alkywall.services;

import com.track3.alkywall.dtos.TransactionCreateDTO;
import com.track3.alkywall.dtos.TransactionResponseDTO;

import java.util.List;

public interface ITransactionService {
    TransactionResponseDTO createTransaction(TransactionCreateDTO dto);
    TransactionResponseDTO getTransactionById(Long id);
    List<TransactionResponseDTO> getTransactionsByAccountId(Long accountId);
}
