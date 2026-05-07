package com.example.cafe_system.auth.service.impl;

import com.example.cafe_system.auth.domain.Role;
import com.example.cafe_system.auth.service.AuthService;
import com.example.cafe_system.auth.service.UserService;
import com.example.cafe_system.security.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceJpa implements AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public String login(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        var user = userService.getByUsername(username);

        return jwtService.generateToken(user);
    }

    @Override
    public String register(String username, String password, Role role) {
        String scrambledPassword = passwordEncoder.encode(password);

        var newUser = userService.createUser(username, scrambledPassword, role);

        return jwtService.generateToken(newUser);
    }
}