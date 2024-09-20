package com.coachtool.app.controllers;

import com.coachtool.app.domain.dto.SignInRequest;
import com.coachtool.app.domain.dto.SignUpRequest;
import com.coachtool.app.domain.entity.Role;
import com.coachtool.app.services.AuthenticationService;
import com.coachtool.app.services.UserService;
import com.coachtool.app.domain.dto.JwtAuthenticationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService service;
    private final AuthenticationService authenticationService;

    @PostMapping("coach/sign-up")
    public ResponseEntity<JwtAuthenticationResponse> coachSignUp(@RequestBody @Valid SignUpRequest request) {
        return ResponseEntity.ok(authenticationService.signUp(request, Role.ROLE_COACH));
    }
    @PostMapping("mentee/sign-up")
    public ResponseEntity<JwtAuthenticationResponse> menteeSignUp(@RequestBody @Valid SignUpRequest request) {
        return ResponseEntity.ok(authenticationService.signUp(request, Role.ROLE_MENTEE));
    }

    @PostMapping("/sign-in")
    public ResponseEntity<JwtAuthenticationResponse> signIn(@RequestBody @Valid SignInRequest request) {
        return ResponseEntity.ok(authenticationService.signIn(request));
    }
    @GetMapping("/get-admin")
    public ResponseEntity<String> getAdmin() {
        service.getAdmin();
        return ResponseEntity.ok("Admin set success");
    }

    @ExceptionHandler
    private ResponseEntity<String> handleException (UsernameNotFoundException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatusCode.valueOf(404));
    }

}

