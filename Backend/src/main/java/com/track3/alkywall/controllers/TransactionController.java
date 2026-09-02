package com.track3.alkywall.controllers;

import com.track3.alkywall.controllers.models.AccountDTO;
import com.track3.alkywall.controllers.models.TransactionDTO;
import com.track3.alkywall.models.Transaction;
import com.track3.alkywall.services.AccountService;
import com.track3.alkywall.services.JwtService;
import com.track3.alkywall.services.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/transaction")
public class TransactionController {
    private final AccountService accountService;
    private final JwtService jwtService;
    private final TransactionService transactionService;

    public TransactionController(AccountService accountService, JwtService jwtService, TransactionService transactionService){
        this.accountService = accountService;
        this.jwtService = jwtService;
        this.transactionService = transactionService;
    }


    @PostMapping("/deposito")
    public ResponseEntity<?> realizarDeposito(Authentication authentication, @RequestParam BigDecimal amount){
        if(authentication!=null) {
            log.info("Authentication name: ", authentication.getName());
            TransactionDTO transactionDTO = transactionService.realizarDeposito(
                    accountService.getAccountByUserEmail(authentication.getName()), amount);
            return ResponseEntity.ok().body(transactionDTO);
        } else{
            log.info("Authentication was null");
            return ResponseEntity.badRequest().body("Credenciales inválidas");
        }
    }
}
