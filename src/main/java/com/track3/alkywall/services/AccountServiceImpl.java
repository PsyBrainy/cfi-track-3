package com.track3.alkywall.services;

import com.track3.alkywall.dtos.AccountCreateDTO;
import com.track3.alkywall.dtos.AccountResponseDTO;
import com.track3.alkywall.models.Account;
import com.track3.alkywall.models.User;
import com.track3.alkywall.repositories.AccountRepository;
import com.track3.alkywall.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements IAccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountServiceImpl(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AccountResponseDTO createAccount(AccountCreateDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Account account = new Account();
        account.setCurrency(dto.getCurrency());
        account.setBalance(BigDecimal.ZERO);
        account.setAccountNumber(generateAccountNumber());
        account.setAlias(generateAlias());
        account.setUser(user);
        
        Account savedAccount = accountRepository.save(account);
        return mapToDTO(savedAccount);
    }

    @Override
    public AccountResponseDTO getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));
        return mapToDTO(account);
    }

    @Override
    public List<AccountResponseDTO> getAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AccountResponseDTO mapToDTO(Account account) {
        AccountResponseDTO dto = new AccountResponseDTO();
        dto.setId(account.getId());
        dto.setAccountNumber(account.getAccountNumber());
        dto.setBalance(account.getBalance());
        dto.setCurrency(account.getCurrency());
        dto.setAlias(account.getAlias());
        dto.setUserId(account.getUser().getId());
        return dto;
    }

    private String generateAccountNumber() {
        return UUID.randomUUID().toString().replaceAll("-", "").substring(0, 22);
    }

    private String generateAlias() {
        String[] words = {"luna", "sol", "mate", "pampa", "rio", "andes", "tango", "cielo"};
        String w1 = words[(int)(Math.random() * words.length)];
        String w2 = words[(int)(Math.random() * words.length)];
        String w3 = words[(int)(Math.random() * words.length)];
        return w1 + "." + w2 + "." + w3;
    }
}
