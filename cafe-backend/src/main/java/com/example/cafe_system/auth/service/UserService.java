package com.example.cafe_system.auth.service;

import com.example.cafe_system.auth.domain.Role;
import com.example.cafe_system.auth.domain.User;

public interface UserService {
    User getByUsername(String username);
    User createUser(String username, String password, Role role);
}
