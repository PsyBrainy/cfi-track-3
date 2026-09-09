package com.track3.alkywall.controllers.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginUserRequest(
        @NotBlank
        @Size(min = 1, max = 150)
        @Email
        String email,

        @NotBlank
        @Size(min = 8, max = 255)
        String password
) {
}
