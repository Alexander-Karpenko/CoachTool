package com.CoachTool.dto.auth;

public record UserInfoResponse(
        String email,
        String firstName,
        String lastName,
        String role
) {}
