package com.track3.alkywall.controllers.models;

import jakarta.validation.constraints.NotBlank;

public record NewContactRequest(
        @NotBlank(message = "El alias o número de cuenta/CVU es obligatorio")
        String accountIdentifier, // Puede ser el Alias o el Número de Cuenta

        @NotBlank(message = "El nombre del contacto es obligatorio")
        String name
) {}