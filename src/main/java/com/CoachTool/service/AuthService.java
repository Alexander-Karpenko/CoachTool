package com.CoachTool.service;

import com.CoachTool.dto.auth.AuthResponse;
import com.CoachTool.dto.auth.LoginRequest;
import com.CoachTool.dto.auth.RegisterRequest;
import com.CoachTool.entity.User;
import com.CoachTool.entity.enums.Role;
import com.CoachTool.exception.EmailAlreadyExistsException;
import com.CoachTool.repository.UserRepository;
import com.CoachTool.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userRepository.findByEmail(request.email()).orElseThrow();
        return buildResponse(jwtTokenProvider.generateToken(auth), user);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }
        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .role(Role.COACH)
                .build();
        userRepository.save(user);

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        return buildResponse(jwtTokenProvider.generateToken(auth), user);
    }

    private AuthResponse buildResponse(String token, User user) {
        return new AuthResponse(token, user.getEmail(), user.getFirstName(),
                user.getLastName(), user.getRole().name());
    }
}
