package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.AlreadyExistsException;
import com.track3.alkywall.config.exceptions.InvalidTransferException;
import com.track3.alkywall.config.exceptions.NotFoundException;
import com.track3.alkywall.models.Account;
import com.track3.alkywall.models.Contact;
import com.track3.alkywall.models.User;
import com.track3.alkywall.repositories.ContactRepository;
import com.track3.alkywall.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AccountService accountService;

    @InjectMocks
    private ContactService contactService;

    private User currentUser;
    private User contactUser;
    private Account destinationAccount;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        currentUser = new User();
        currentUser.setId(1L);
        currentUser.setEmail("user@test.com");

        contactUser = new User();
        contactUser.setId(2L);
        contactUser.setEmail("contact@test.com");

        destinationAccount = new Account();
        destinationAccount.setId(10L);
        destinationAccount.setUser(contactUser);
        destinationAccount.setAlias("mi.alias.test");
        destinationAccount.setAccountNumber("0000000000000000000010");
    }

    @Test
    void addContact_Success() {
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(currentUser));
        when(accountService.getAccountByAccountNumberOrAlias("mi.alias.test")).thenReturn(destinationAccount);
        when(contactRepository.existsByUserEmailAndContactUserId("user@test.com", 2L)).thenReturn(false);
        when(contactRepository.save(any(Contact.class))).thenAnswer(i -> i.getArgument(0));

        Contact result = contactService.addContact("user@test.com", "mi.alias.test", "Mi Amigo");

        assertNotNull(result);
        assertEquals("Mi Amigo", result.getName());
        assertEquals(currentUser, result.getUser());
        assertEquals(contactUser, result.getContactUser());
    }

    @Test
    void addContact_ThrowException_WhenAddingSelf() {
        Account selfAccount = new Account();
        selfAccount.setUser(currentUser);

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(currentUser));
        when(accountService.getAccountByAccountNumberOrAlias("mi.propio.alias")).thenReturn(selfAccount);

        assertThrows(InvalidTransferException.class, () ->
                contactService.addContact("user@test.com", "mi.propio.alias", "Yo Mismo")
        );
    }

    @Test
    void addContact_ThrowException_WhenAlreadyExists() {
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(currentUser));
        when(accountService.getAccountByAccountNumberOrAlias("mi.alias.test")).thenReturn(destinationAccount);
        when(contactRepository.existsByUserEmailAndContactUserId("user@test.com", 2L)).thenReturn(true);

        assertThrows(AlreadyExistsException.class, () ->
                contactService.addContact("user@test.com", "mi.alias.test", "Mi Amigo")
        );
    }

    @Test
    void deleteContact_Success() {
        Contact contact = new Contact(currentUser, contactUser, "Amigo");
        when(contactRepository.findByIdAndUserEmail(10L, "user@test.com")).thenReturn(Optional.of(contact));

        assertDoesNotThrow(() -> contactService.deleteContact("user@test.com", 10L));
        verify(contactRepository, times(1)).delete(contact);
    }

    @Test
    void deleteContact_ThrowException_WhenNotFound() {
        when(contactRepository.findByIdAndUserEmail(10L, "user@test.com")).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> contactService.deleteContact("user@test.com", 10L));
    }
}