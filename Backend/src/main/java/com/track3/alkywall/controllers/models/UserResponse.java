package com.track3.alkywall.controllers.models;

import com.track3.alkywall.services.models.DomainUser;

import java.time.LocalDateTime;

public record UserResponse (
        Long id,
        String firstName,
        String lastName,
        String email,
        String dni,
        String role,
        Boolean isActive,
        LocalDateTime createdAt,
        AccountDTO account
){
    public static UserResponse from(DomainUser user){
        return new UserResponse(
                user.id(),
                user.firstName(),
                user.lastName(),
                user.email(),
                user.dni(),
                user.role().getName(),
                user.isActive(),
                user.createdAt(),
                user.account() == null ? null : AccountDTO.from(user.account())
        );
    }
}
