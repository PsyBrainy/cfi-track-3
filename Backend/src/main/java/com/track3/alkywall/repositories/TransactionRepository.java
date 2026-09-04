package com.track3.alkywall.repositories;

import com.track3.alkywall.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByAccountIdOrderByCreatedAtDesc(Long accountId);
}
