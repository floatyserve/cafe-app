package com.example.cafe_system.auth.service.impl;

import com.example.cafe_system.auth.domain.Role;
import com.example.cafe_system.auth.domain.User;
import com.example.cafe_system.auth.service.UserService;
import com.example.cafe_system.exceptions.BadRequestException;
import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.security.service.JwtService;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceJpaTest {

    private static final String TEST_USER = "testuser";
    private static final String TEST_PASSWORD = "password123";
    private static final String ENCODED_PASSWORD = "encoded_password_hash";
    private static final String MOCK_TOKEN = "mocked-jwt-token";
    private static final String WRONG_PASSWORD = "wrong_password";

    @Mock private UserService userService;
    @Mock private JwtService jwtService;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceJpa authService;

    @Nested
    class Login {

        @Test
        void shouldReturnToken_WhenCredentialsAreValid() {
            User mockUser = User.builder().username(TEST_USER).build();
            when(userService.getByUsername(TEST_USER)).thenReturn(mockUser);
            when(jwtService.generateToken(mockUser)).thenReturn(MOCK_TOKEN);

            String token = authService.login(TEST_USER, TEST_PASSWORD);

            assertThat(token).isEqualTo(MOCK_TOKEN);
            verify(authenticationManager).authenticate(
                    new UsernamePasswordAuthenticationToken(TEST_USER, TEST_PASSWORD)
            );
        }

        @Test
        void shouldAuthenticateBeforeFetchingUser_WhenLoggingIn() {
            User mockUser = User.builder().username(TEST_USER).build();
            when(userService.getByUsername(TEST_USER)).thenReturn(mockUser);
            when(jwtService.generateToken(mockUser)).thenReturn(MOCK_TOKEN);

            InOrder order = inOrder(authenticationManager, userService, jwtService);

            authService.login(TEST_USER, TEST_PASSWORD);

            order.verify(authenticationManager).authenticate(any());
            order.verify(userService).getByUsername(TEST_USER);
            order.verify(jwtService).generateToken(mockUser);
        }

        @Test
        void shouldThrowBadCredentialsException_WhenPasswordIsWrong() {
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new BadCredentialsException("Bad credentials"));

            assertThatThrownBy(() -> authService.login(TEST_USER, WRONG_PASSWORD))
                    .isInstanceOf(BadCredentialsException.class);

            verifyNoInteractions(userService, jwtService);
        }

        @Test
        void shouldThrowReferenceNotFoundException_WhenUserDoesNotExist() {
            when(authenticationManager.authenticate(any())).thenReturn(null);
            when(userService.getByUsername(TEST_USER))
                    .thenThrow(new ReferenceNotFoundException("User not found"));

            assertThatThrownBy(() -> authService.login(TEST_USER, TEST_PASSWORD))
                    .isInstanceOf(ReferenceNotFoundException.class);

            verifyNoInteractions(jwtService);
        }
    }

    @Nested
    class Register {

        @Test
        void shouldEncodePasswordAndReturnToken_WhenRegistrationIsSuccessful() {
            when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
            User newUser = User.builder().username(TEST_USER).password(ENCODED_PASSWORD).role(Role.WORKER).build();
            when(userService.createUser(TEST_USER, ENCODED_PASSWORD, Role.WORKER)).thenReturn(newUser);
            when(jwtService.generateToken(newUser)).thenReturn(MOCK_TOKEN);

            String token = authService.register(TEST_USER, TEST_PASSWORD, Role.WORKER);

            assertThat(token).isEqualTo(MOCK_TOKEN);
            verify(passwordEncoder).encode(TEST_PASSWORD);
            verify(userService).createUser(TEST_USER, ENCODED_PASSWORD, Role.WORKER);
        }

        @Test
        void shouldNeverStoreRawPassword_WhenRegistering() {
            when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
            User newUser = User.builder().username(TEST_USER).password(ENCODED_PASSWORD).role(Role.WORKER).build();
            when(userService.createUser(any(), any(), any())).thenReturn(newUser);
            when(jwtService.generateToken(any())).thenReturn(MOCK_TOKEN);

            authService.register(TEST_USER, TEST_PASSWORD, Role.WORKER);

            ArgumentCaptor<String> passwordCaptor = ArgumentCaptor.forClass(String.class);
            verify(userService).createUser(eq(TEST_USER), passwordCaptor.capture(), eq(Role.WORKER));
            assertThat(passwordCaptor.getValue())
                    .isNotEqualTo(TEST_PASSWORD)
                    .isEqualTo(ENCODED_PASSWORD);
        }

        @Test
        void shouldThrowBadRequestException_WhenUsernameAlreadyExists() {
            when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
            when(userService.createUser(TEST_USER, ENCODED_PASSWORD, Role.WORKER))
                    .thenThrow(new BadRequestException("User already exists"));

            assertThatThrownBy(() -> authService.register(TEST_USER, TEST_PASSWORD, Role.WORKER))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("already exists");

            verifyNoInteractions(jwtService);
        }

        @Test
        void shouldSupportAllRoles_WhenRegistering() {
            for (Role role : Role.values()) {
                User newUser = User.builder().username(TEST_USER).password(ENCODED_PASSWORD).role(role).build();
                when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
                when(userService.createUser(TEST_USER, ENCODED_PASSWORD, role)).thenReturn(newUser);
                when(jwtService.generateToken(newUser)).thenReturn(MOCK_TOKEN);

                String token = authService.register(TEST_USER, TEST_PASSWORD, role);

                assertThat(token).isEqualTo(MOCK_TOKEN);
            }
        }
    }
}