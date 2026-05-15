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

import static org.junit.jupiter.api.Assertions.*;
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

            assertEquals(TEST_USER, result.getUsername());
            verify(userRepository).findByUsername(TEST_USER);
        }

        @Test
        void shouldThrowReferenceNotFoundException_WhenUserDoesNotExist() {
            when(userRepository.findByUsername(TEST_USER)).thenReturn(Optional.empty());

            assertThrows(ReferenceNotFoundException.class, () -> userService.getByUsername(TEST_USER));
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

            assertEquals(TEST_USER, result.getUsername());
            assertEquals(Role.WORKER, result.getRole());
            verify(userRepository).save(any(User.class));
        }

        @Test
        void shouldThrowException_WhenUsernameAlreadyExists() {
            User existingUser = User.builder().username(TEST_USER).build();
            when(userRepository.findByUsername(TEST_USER)).thenReturn(Optional.of(existingUser));

            BadRequestException ex = assertThrows(BadRequestException.class, () -> userService.createUser(TEST_USER, TEST_PASS, Role.WORKER));
            assertTrue(ex.getMessage().contains("already exists"));

            verify(userRepository, never()).save(any(User.class));
        }
    }
}