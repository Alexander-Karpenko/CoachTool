package com.coachtool.app.services;

import com.coachtool.app.domain.dto.JwtAuthenticationResponse;
import com.coachtool.app.domain.dto.SignInRequest;
import com.coachtool.app.domain.dto.SignUpRequest;
import com.coachtool.app.domain.entity.Role;
import com.coachtool.app.domain.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public JwtAuthenticationResponse signUp(SignUpRequest request, Role role) {

        var user = User.builder()
                .username(request.getUsername())
                .name(request.getName())
                .middleName(request.getMiddleName())
                .surname(request.getSurname())
                .email(request.getEmail())
                .dateOfBirth(request.getDateOfBirth())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userService.create(user);

        var jwt = jwtService.generateToken(user);
        return new JwtAuthenticationResponse(jwt);
    }

    public JwtAuthenticationResponse signIn(SignInRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
        ));

        var user = userService
                .userDetailsService()
                .loadUserByUsername(request.getUsername());

        var jwt = jwtService.generateToken(user);
        return new JwtAuthenticationResponse(jwt);
    }
}
