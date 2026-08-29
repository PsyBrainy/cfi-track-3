package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.AccountNotFoundException;
import com.track3.alkywall.controllers.models.AccountDTO;
import com.track3.alkywall.models.Account;
import com.track3.alkywall.repositories.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    public AccountService(AccountRepository accountRepository){
        this.accountRepository = accountRepository;
    }
    public AccountDTO getAccountDTOByUserEmail(String userEmail){
        Optional<Account> account = accountRepository.findByUserEmail(userEmail);
        if(account.isPresent()){
            return toDTO(account.get());
        } else{
            throw new AccountNotFoundException("No se pudo encontrar la cuenta");
        }
    }
    private static AccountDTO toDTO(Account account){
        return new AccountDTO(
                account.getSaldo(),
                account.getCurrency(),
                account.getAlias(),
                account.getIsActive()
        );
    }
}
