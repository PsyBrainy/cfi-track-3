package com.track3.alkywall.services.models;

import com.track3.alkywall.models.Role;
import com.track3.alkywall.models.User;

import java.time.LocalDateTime;

public record DomainUser(
        Long id,
        String firstName,
        String lastName,
        String email,
        String dni,
        Role role,
        Boolean isActive,
        LocalDateTime createdAt
) {
    public static DomainUser from(User user){
        return new DomainUser(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getDni(),
                user.getRole(),
                user.getIsActive(),
                user.getCreatedAt()
        );
    }
}
