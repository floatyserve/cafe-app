package com.example.cafe_system.auth.api.dto;

import com.example.cafe_system.auth.domain.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
        @NotBlank(message = "Username cannot be blank") String username,
        @NotBlank(message = "Password cannot be blank") String password,
        @NotNull(message = "Role must be specified") Role role
) {}