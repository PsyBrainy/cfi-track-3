package com.track3.alkywall.controllers.models;

import jakarta.validation.constraints.NotBlank;

public record NewContactRequest(
        @NotBlank(message = "El identificador del contacto (email) es obligatorio")
        String contactEmail,

        @NotBlank(message = "El nombre del contacto es obligatorio")
        String name
) {}