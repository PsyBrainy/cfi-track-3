package com.track3.alkywall.services;

import com.track3.alkywall.dtos.AccountCreateDTO;
import com.track3.alkywall.dtos.AccountResponseDTO;

import java.util.List;

public interface IAccountService {
    AccountResponseDTO createAccount(AccountCreateDTO dto);
    AccountResponseDTO getAccountById(Long id);
    List<AccountResponseDTO> getAccountsByUserId(Long userId);
}
