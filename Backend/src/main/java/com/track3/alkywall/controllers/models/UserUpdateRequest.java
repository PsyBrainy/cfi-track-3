package com.track3.alkywall.controllers.models;

import com.track3.alkywall.models.Role;
import com.track3.alkywall.services.models.DomainUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
        @NotBlank
        @Size(min = 1, max = 100)
        String firstName,

        @NotBlank
        @Size(min = 1, max = 100)
        String lastName,

        @NotBlank
        @Size(min = 1, max = 150)
        @Email
        String email,

        @NotBlank
        @Size(min = 1, max = 20)
        String dni,

        @NotBlank
        String role,

        @NotNull
        Boolean isActive
){
    public static DomainUser toDomainUser(UserUpdateRequest userUpdateRequest, Long id){
        return new DomainUser(
                id,
                userUpdateRequest.firstName(),
                userUpdateRequest.lastName(),
                userUpdateRequest.email(),
                userUpdateRequest.dni(),
                new Role(userUpdateRequest.role()),
                userUpdateRequest.isActive(),
                null,
                null
        );
    }
}
