package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.AlreadyExistsException;
import com.track3.alkywall.config.exceptions.InvalidTransferException;
import com.track3.alkywall.config.exceptions.NotFoundException;
import com.track3.alkywall.models.Contact;
import com.track3.alkywall.models.User;
import com.track3.alkywall.repositories.ContactRepository;
import com.track3.alkywall.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public ContactService(ContactRepository contactRepository, UserRepository userRepository) {
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
    }


    @Transactional
    public Contact addContact(String currentUserEmail, String contactEmail, String name) {
        log.info("Usuario {} intentando agregar como contacto a {}", currentUserEmail, contactEmail);

        if (currentUserEmail.equalsIgnoreCase(contactEmail)) {
            log.error("El usuario {} intentó agregarse a sí mismo", currentUserEmail);
            throw new InvalidTransferException("No puedes agregarte a ti mismo como contacto");
        }

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new NotFoundException("Usuario autenticado no encontrado"));

        User contactUser = userRepository.findByEmail(contactEmail)
                .orElseThrow(() -> new NotFoundException("El contacto a agregar no existe en el sistema"));

        if (contactRepository.existsByUserEmailAndContactUserId(currentUserEmail, contactUser.getId())) {
            log.error("El contacto {} ya existe en la lista de {}", contactEmail, currentUserEmail);
            throw new AlreadyExistsException("Este usuario ya se encuentra en tu lista de contactos");
        }

        Contact contact = new Contact(currentUser, contactUser, name);
        return contactRepository.save(contact);
    }

    @Transactional
    public void deleteContact(String currentUserEmail, Long contactId) {
        log.info("Usuario {} eliminando contacto con ID {}", currentUserEmail, contactId);

        Contact contact = contactRepository.findByIdAndUserEmail(contactId, currentUserEmail)
                .orElseThrow(() -> new NotFoundException("Contacto no encontrado o no tienes permiso para eliminarlo"));

        contactRepository.delete(contact);
    }

    @Transactional(readOnly = true)
    public List<Contact> getContactsByUser(String currentUserEmail) {
        return contactRepository.findByUserEmail(currentUserEmail);
    }
}