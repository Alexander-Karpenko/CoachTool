package com.CoachTool.controller;

import com.CoachTool.dto.auth.ProfileUpdateRequest;
import com.CoachTool.dto.auth.UserInfoResponse;
import com.CoachTool.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final AuthService authService;

    @GetMapping
    public ResponseEntity<UserInfoResponse> getProfile(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(authService.getProfile(principal.getUsername()));
    }

    @PutMapping
    public ResponseEntity<UserInfoResponse> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(authService.updateProfile(principal.getUsername(), request));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal UserDetails principal) {
        authService.deleteAccount(principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}
