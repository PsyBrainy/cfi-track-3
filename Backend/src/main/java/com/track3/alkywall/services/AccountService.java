package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.AlreadyExistsException;
import com.track3.alkywall.config.exceptions.NotFoundException;
import com.track3.alkywall.controllers.models.AccountDTO;
import com.track3.alkywall.models.Account;
import com.track3.alkywall.models.User;
import com.track3.alkywall.repositories.AccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.Optional;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final SecureRandom random;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
        this.random = new SecureRandom();
    }

    public AccountDTO getAccountDTOByUserEmail(String userEmail){
        Optional<Account> account = accountRepository.findByUserEmail(userEmail);
        if(account.isPresent()){
            return AccountDTO.from(account.get());
        } else{
            throw new NotFoundException("No se pudo encontrar la cuenta");
        }
    }

    public Account getAccountByUserEmail(String userEmail){
        Optional<Account> account = accountRepository.findByUserEmail(userEmail);
        if(account.isPresent()){
            return account.get();
        } else{
            throw new NotFoundException("No se pudo encontrar la cuenta");
        }
    }

    @Transactional
    public void createAccount(User user, String currency){
        if(user.getAccount() != null){
            throw new AlreadyExistsException("El usuario ya tiene una cuenta");
        }

        Account account = accountRepository.save(new Account(
                new BigDecimal(0),
                currency,
                user,
                generateAlias(user.getEmail())
        ));

        // Se hace después del save para que el id este disponible
        account.setAccountNumber(generateAccountNumber(account.getId()));
    }

    private String generateAlias(String email){
        String[] words = {"sol", "luna", "hoja", "caballo", "vaca", "gato", "perro"};
        String emailStart = email.substring(0, email.indexOf("@"));

        return
                emailStart+"."+
                words[random.nextInt(words.length)]+"."+
                random.nextInt(1000);
    }

    private String generateAccountNumber(Long id){
        return String.format("%022d", id);
    }

    public boolean accountExistsByAccountNumberAndEmail(String accountNumber, String email){
        return accountRepository.existsByAccountNumberAndUserEmail(accountNumber, email);
    }
}
