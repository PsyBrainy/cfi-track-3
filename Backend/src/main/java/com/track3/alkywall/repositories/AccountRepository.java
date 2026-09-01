package com.track3.alkywall.repositories;

import com.track3.alkywall.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    public Optional<Account> findByUserEmail(String userEmail);

//    @Query("select * from account a INNER JOIN user u ON a.user_id = u.id where a.email = ?")
//    public Optional<Account> findByUserEmail(String userEmail);
}
