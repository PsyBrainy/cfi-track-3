package com.track3.alkywall.controllers;

import com.track3.alkywall.config.ApiResponse;
import com.track3.alkywall.config.DataApiResponse;
import com.track3.alkywall.controllers.models.ContactResponse;
import com.track3.alkywall.controllers.models.NewContactRequest;
import com.track3.alkywall.models.Contact;
import com.track3.alkywall.services.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<DataApiResponse<ContactResponse>> addContact(
            Authentication authentication,
            @RequestBody @Valid NewContactRequest request
    ) {
        Contact contact = contactService.addContact(
                authentication.getName(),
                request.accountIdentifier(),
                request.name()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(new DataApiResponse<>(
                true,
                "Contacto añadido exitosamente",
                ContactResponse.from(contact)
        ));
    }

    @GetMapping
    public ResponseEntity<DataApiResponse<List<ContactResponse>>> getContacts(
            Authentication authentication
    ) {
        List<Contact> contacts = contactService.getContactsByUser(authentication.getName());
        List<ContactResponse> response = contacts.stream()
                .map(ContactResponse::from)
                .toList();

        return ResponseEntity.ok(new DataApiResponse<>(
                true,
                "Contactos obtenidos exitosamente",
                response
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteContact(
            Authentication authentication,
            @PathVariable Long id
    ) {
        contactService.deleteContact(authentication.getName(), id);

        return ResponseEntity.ok(new ApiResponse(
                true,
                "Contacto eliminado exitosamente"
        ));
    }
}