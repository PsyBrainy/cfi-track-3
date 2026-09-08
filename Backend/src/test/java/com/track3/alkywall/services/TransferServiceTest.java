package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.InsufficientFundsException;
import com.track3.alkywall.config.exceptions.InvalidTransferException;
import com.track3.alkywall.models.*;
import com.track3.alkywall.repositories.CategoryRepository;
import com.track3.alkywall.repositories.TransactionRepository;
import com.track3.alkywall.repositories.TransferRepository;
import com.track3.alkywall.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class TransferServiceTest {
    @Mock
    private AccountService accountService;

    @Mock
    TransferRepository transferRepository;

    @Mock
    CategoryRepository categoryRepository;

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private TransferService transferService;

    private User originUser;
    private User destinationUser;
    private Account originAccount;
    private Account destinationAccount;


    @BeforeEach
    void setUp() {
        originUser = new User();
        originUser.setId(1L);
        originUser.setEmail("originUser@test.com");

        destinationUser = new User();
        destinationUser.setId(2L);
        destinationUser.setEmail("destinationUser@test.com");

        originAccount = new Account();
        originAccount.setId(100L);
        originAccount.setUser(originUser);
        originAccount.setBalance(BigDecimal.valueOf(1000));
        originAccount.setAlias("alias.origen.test");
        originAccount.setAccountNumber("0000000000000000000011");

        destinationAccount = new Account();
        destinationAccount.setId(10L);
        destinationAccount.setBalance(BigDecimal.ZERO);
        destinationAccount.setUser(destinationUser);
        destinationAccount.setAlias("alias.destino.test");
        destinationAccount.setAccountNumber("0000000000000000000010");
    }

    @Test
    void transferSuccess() {
        BigDecimal amount = BigDecimal.valueOf(100);
        Category category = new Category();
        category.setName("TRANSFER");
        when(accountService.getAccountByUserEmail("originUser@test.com"))
                .thenReturn(originAccount);
        when(accountService.getAccountByAccountNumberOrAlias("alias.destino.test"))
                .thenReturn(destinationAccount);
        when(categoryRepository.findByName("TRANSFER"))
                .thenReturn(Optional.of(category));
        // Ejecutar el metodo real para modificar los saldos
        doCallRealMethod()
                .when(transactionService)
                .modifyAccountBalance(
                        any(Account.class),
                        any(String.class),
                        any(BigDecimal.class)
                );
        when(transferRepository.saveAll(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));
        transferService.createTransfer(
                "originUser@test.com",
                "alias.destino.test",
                amount,
                "Transferencia de prueba"
        );
        // OriginAccount tenía $1000 y envía $100
        assertEquals(
                BigDecimal.valueOf(900),
                originAccount.getBalance()
        );
        // DestinationAccount tenía $0 y recibe $100
        assertEquals(
                BigDecimal.valueOf(100),
                destinationAccount.getBalance()
        );
    }
    @Test
    void transfer_ThrowException_WhenTransferingSelf() {
        when(accountService.getAccountByUserEmail("originUser@test.com"))
                .thenReturn(originAccount);
        // La cuenta destino es la misma cuenta de origen
        when(accountService.getAccountByAccountNumberOrAlias("alias.origen.test"))
                .thenReturn(originAccount);
        assertThrows(
                InvalidTransferException.class,
                () -> transferService.createTransfer(
                        "originUser@test.com",
                        "alias.origen.test",
                        BigDecimal.valueOf(100),
                        "Transferencia a sí mismo"
                )
        );
        // No debe buscarse la categoría
        verify(categoryRepository, never())
                .findByName("TRANSFER");
        // No se deben modificar los balances
        verify(transactionService, never())
                .modifyAccountBalance(
                        any(Account.class),
                        any(String.class),
                        any(BigDecimal.class)
                );
        // No se debe guardar ninguna transferencia
        verify(transferRepository, never()).saveAll(any());
    }

    @Test
    void transfer_ThrowException_WhenInsufficientFunds() {
        BigDecimal amount = BigDecimal.valueOf(10000);
        when(accountService.getAccountByUserEmail("originUser@test.com"))
                .thenReturn(originAccount);
        when(accountService.getAccountByAccountNumberOrAlias("alias.destino.test"))
                .thenReturn(destinationAccount);
        Category category = new Category();
        category.setName("TRANSFER");
        when(categoryRepository.findByName("TRANSFER"))
                .thenReturn(Optional.of(category));
        doCallRealMethod()
                .when(transactionService)
                .modifyAccountBalance(
                        any(Account.class),
                        any(String.class),
                        any(BigDecimal.class)
                );
        assertThrows(
                InsufficientFundsException.class,
                () -> transferService.createTransfer(
                        "originUser@test.com",
                        "alias.destino.test",
                        amount,
                        "Transferencia con saldo insuficiente"
                )
        );
        // No se debe guardar ninguna transferencia
        verify(transferRepository, never()).saveAll(any());
        // Los saldos tampoco deben modificarse
        assertEquals(
                BigDecimal.valueOf(1000),
                originAccount.getBalance()
        );
        assertEquals(
                BigDecimal.ZERO,
                destinationAccount.getBalance()
        );
    };
}