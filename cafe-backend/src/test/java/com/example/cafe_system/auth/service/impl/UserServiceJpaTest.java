package com.example.cafe_system.auth.service.impl;

import com.example.cafe_system.auth.domain.Role;
import com.example.cafe_system.auth.domain.User;
import com.example.cafe_system.auth.repository.UserRepository;
import com.example.cafe_system.exceptions.BadRequestException;
import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceJpaTest {

    private static final String TEST_USER = "testuser";
    private static final String TEST_PASS = "password123";

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceJpa userService;

    @Nested
    class GetByUsername {

        @Test
        void shouldReturnUser_WhenUserExists() {
            User mockUser = User.builder().username(TEST_USER).build();
            when(userRepository.findByUsername(TEST_USER)).thenReturn(Optional.of(mockUser));

            User result = userService.getByUsername(TEST_USER);

            assertThat(result.getUsername()).isEqualTo(TEST_USER);
            verify(userRepository).findByUsername(TEST_USER);
        }

        @Test
        void shouldThrowReferenceNotFoundException_WhenUserDoesNotExist() {
            when(userRepository.findByUsername(TEST_USER)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> userService.getByUsername(TEST_USER))
                    .isInstanceOf(ReferenceNotFoundException.class);
        }
    }

    @Nested
    class CreateUser {

        @Test
        void shouldSaveAndReturnUser_WhenUsernameIsUnique() {
            when(userRepository.findByUsername(TEST_USER)).thenReturn(Optional.empty());

            User savedUser = User.builder().username(TEST_USER).password(TEST_PASS).role(Role.WORKER).build();
            when(userRepository.save(any(User.class))).thenReturn(savedUser);

            User result = userService.createUser(TEST_USER, TEST_PASS, Role.WORKER);

            assertThat(result.getUsername()).isEqualTo(TEST_USER);
            assertThat(result.getRole()).isEqualTo(Role.WORKER);
            verify(userRepository).save(any(User.class));
        }

        @Test
        void shouldThrowException_WhenUsernameAlreadyExists() {
            User existingUser = User.builder().username(TEST_USER).build();
            when(userRepository.findByUsername(TEST_USER)).thenReturn(Optional.of(existingUser));

            assertThatThrownBy(() -> userService.createUser(TEST_USER, TEST_PASS, Role.WORKER))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("already exists");

            verify(userRepository, never()).save(any(User.class));
        }
    }
}