package com.example.cafe_system.auth.service;

import com.example.cafe_system.auth.domain.Role;

public interface AuthService {
    String login(String username, String password);
    String register(String username, String password, Role role);
}
