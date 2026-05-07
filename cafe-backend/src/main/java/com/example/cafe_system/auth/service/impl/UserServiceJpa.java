package com.example.cafe_system.auth.service.impl;

import com.example.cafe_system.auth.domain.Role;
import com.example.cafe_system.auth.domain.User;
import com.example.cafe_system.auth.repository.UserRepository;
import com.example.cafe_system.auth.service.UserService;
import com.example.cafe_system.exceptions.BadRequestException;
import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceJpa implements UserService {
    private final UserRepository userRepository;

    @Override
    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ReferenceNotFoundException("User with username " + username + " not found")
                );
    }

    @Override
    public User createUser(String username, String password, Role role) {
        User newUser = User.builder()
                .username(username)
                .password(password)
                .role(role)
                .build();

        assertUserCanBeCreated(newUser);

        return userRepository.save(newUser);
    }

    private void assertUserCanBeCreated(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new BadRequestException("User with username " + user.getUsername() + " already exists");
        }
    }
}
