package com.vitrine.auth;

import com.vitrine.auth.dto.LoginRequest;
import com.vitrine.auth.dto.LoginResponse;
import com.vitrine.auth.service.AuthService;
import com.vitrine.auth.service.JwtService;
import com.vitrine.user.domain.Role;
import com.vitrine.user.domain.User;
import com.vitrine.user.port.UserRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepositoryPort userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void shouldLoginSuccessfullyWithValidCredentials() {
        UUID userId = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();
        String email = "master@grafica.com.br";
        String password = "securePassword123";
        String passwordHash = "$2a$10$hashedPassword";

        User user = User.create(userId, tenantId, "Master User", email, passwordHash, Role.MASTER);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(password, passwordHash)).thenReturn(true);
        when(jwtService.generateToken(eq(userId), eq(tenantId), eq(email), eq("MASTER")))
                .thenReturn("mocked.jwt.token");

        LoginResponse response = authService.login(new LoginRequest(email, password));

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(userId, response.getUser().getId());
        assertEquals(tenantId, response.getUser().getTenantId());
        assertEquals("Master User", response.getUser().getName());
        assertEquals(email, response.getUser().getEmail());
        assertEquals(Role.MASTER, response.getUser().getRole());
    }

    @Test
    void shouldThrowBadCredentialsWhenUserNotFound() {
        when(userRepository.findByEmail("unknown@email.com")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () ->
                authService.login(new LoginRequest("unknown@email.com", "password")));
    }

    @Test
    void shouldThrowBadCredentialsWhenPasswordDoesNotMatch() {
        User user = User.create(UUID.randomUUID(), UUID.randomUUID(), "User", "user@email.com", "hash", Role.MASTER);
        when(userRepository.findByEmail("user@email.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "hash")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () ->
                authService.login(new LoginRequest("user@email.com", "wrongPassword")));
    }
}
