package com.track3.alkywall.repositories;

import com.track3.alkywall.models.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long> {
    List<Transfer> findBySourceTransaction_SourceAccount_User_Id(Long userId);
}
