package com.CoachTool.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
        @NotBlank(message = "First name is required") String firstName,
        @NotBlank(message = "Last name is required") String lastName,
        String currentPassword,
        @Size(min = 8, message = "Password must be at least 8 characters") String newPassword
) {}
