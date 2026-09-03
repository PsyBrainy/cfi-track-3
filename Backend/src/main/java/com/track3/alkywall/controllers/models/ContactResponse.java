package com.track3.alkywall.controllers.models;

import com.track3.alkywall.models.Contact;

public record ContactResponse(
        Long id,
        String name,
        Long contactUserId,
        String contactFirstName,
        String contactLastName,
        String contactEmail,
        String accountNumber,
        String alias
) {
    public static ContactResponse from(Contact contact) {
        var contactUser = contact.getContactUser();
        var account = contactUser.getAccount();

        return new ContactResponse(
                contact.getId(),
                contact.getName(),
                contactUser.getId(),
                contactUser.getFirstName(),
                contactUser.getLastName(),
                contactUser.getEmail(),
                account != null ? account.getAccountNumber() : null,
                account != null ? account.getAlias() : null
        );
    }
}