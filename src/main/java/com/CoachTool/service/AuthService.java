package com.CoachTool.service;

import com.CoachTool.dto.auth.AuthResponse;
import com.CoachTool.dto.auth.LoginRequest;
import com.CoachTool.dto.auth.ProfileUpdateRequest;
import com.CoachTool.dto.auth.RegisterRequest;
import com.CoachTool.dto.auth.UserInfoResponse;
import com.CoachTool.entity.User;
import com.CoachTool.entity.enums.Role;
import com.CoachTool.exception.EmailAlreadyExistsException;
import com.CoachTool.exception.ResourceNotFoundException;
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

    @Transactional(readOnly = true)
    public UserInfoResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));
        return toUserInfo(user);
    }

    public UserInfoResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        if (request.newPassword() != null && !request.newPassword().isBlank()) {
            if (request.currentPassword() == null
                    || !passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.newPassword()));
        }
        userRepository.save(user);
        return toUserInfo(user);
    }

    public void deleteAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));
        userRepository.delete(user);
    }

    private AuthResponse buildResponse(String token, User user) {
        return new AuthResponse(token, user.getEmail(), user.getFirstName(),
                user.getLastName(), user.getRole().name());
    }

    private UserInfoResponse toUserInfo(User user) {
        return new UserInfoResponse(user.getEmail(), user.getFirstName(),
                user.getLastName(), user.getRole().name());
    }
}
