package com.track3.alkywall.repositories;

import com.track3.alkywall.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUserEmail(String userEmail);

    public Optional<BigDecimal> getSaldoById(Long id);

    @Modifying
    @Query("update Account a set a.balance = ?2 where a.id = ?1")
    void updateBalanceById(Long id, BigDecimal amount);

    Optional<Account> findByAccountNumber(String accountNumber);
}
