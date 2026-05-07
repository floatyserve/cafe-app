package com.example.cafe_system.auth.api.controller;

import com.example.cafe_system.auth.api.dto.LoginRequest;
import com.example.cafe_system.auth.api.dto.RegisterRequest;
import com.example.cafe_system.auth.domain.Role;
import com.example.cafe_system.auth.service.AuthService;
import com.example.cafe_system.exceptions.BadRequestException;
import com.example.cafe_system.exceptions.ReferenceNotFoundException;
import com.example.cafe_system.security.service.JwtService;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.json.JsonMapper;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    private static final String LOGIN_URL = "/api/auth/login";
    private static final String REGISTER_URL = "/api/auth/register";
    private static final String MOCK_TOKEN = "mocked-jwt-token";
    private static final String VALID_USERNAME = "admin";
    private static final String VALID_PASSWORD = "password123";
    private static final String TOKEN_JSON_PATH = "$.token";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper jsonMapper;

    @MockitoBean private JwtService jwtService;
    @MockitoBean private UserDetailsService userService;
    @MockitoBean private AuthService authService;

    @Nested
    class Login {

        @Test
        void shouldReturn200OkAndToken_WhenCredentialsAreValid() throws Exception {
            LoginRequest request = new LoginRequest(VALID_USERNAME, VALID_PASSWORD);
            when(authService.login(VALID_USERNAME, VALID_PASSWORD)).thenReturn(MOCK_TOKEN);

            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath(TOKEN_JSON_PATH).value(MOCK_TOKEN));
        }

        @Test
        void shouldReturn400BadRequest_WhenUsernameIsBlank() throws Exception {
            LoginRequest request = new LoginRequest("", VALID_PASSWORD);

            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void shouldReturn400BadRequest_WhenPasswordIsBlank() throws Exception {
            LoginRequest request = new LoginRequest(VALID_USERNAME, "");

            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void shouldReturn400BadRequest_WhenBodyIsMissing() throws Exception {
            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void shouldReturn401Unauthorized_WhenCredentialsAreInvalid() throws Exception {
            LoginRequest request = new LoginRequest(VALID_USERNAME, "wrong_password");
            when(authService.login(VALID_USERNAME, "wrong_password"))
                    .thenThrow(new BadCredentialsException("Bad credentials"));

            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        void shouldReturn404NotFound_WhenUserDoesNotExist() throws Exception {
            LoginRequest request = new LoginRequest("unknown_user", VALID_PASSWORD);
            when(authService.login("unknown_user", VALID_PASSWORD))
                    .thenThrow(new ReferenceNotFoundException("User not found"));

            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    class Register {

        @Test
        void shouldReturn201CreatedAndToken_WhenRequestIsValid() throws Exception {
            RegisterRequest request = new RegisterRequest(VALID_USERNAME, VALID_PASSWORD, Role.WORKER);
            when(authService.register(VALID_USERNAME, VALID_PASSWORD, Role.WORKER)).thenReturn(MOCK_TOKEN);

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath(TOKEN_JSON_PATH).value(MOCK_TOKEN));
        }

        @Test
        void shouldReturn400BadRequest_WhenRoleIsNull() throws Exception {
            RegisterRequest request = new RegisterRequest(VALID_USERNAME, VALID_PASSWORD, null);

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void shouldReturn400BadRequest_WhenUsernameIsBlank() throws Exception {
            RegisterRequest request = new RegisterRequest("", VALID_PASSWORD, Role.WORKER);

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void shouldReturn400BadRequest_WhenPasswordIsBlank() throws Exception {
            RegisterRequest request = new RegisterRequest(VALID_USERNAME, "", Role.WORKER);

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void shouldReturn400BadRequest_WhenBodyIsMissing() throws Exception {
            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());
        }

        @Test
        void shouldReturn400BadRequest_WhenUsernameAlreadyExists() throws Exception {
            RegisterRequest request = new RegisterRequest(VALID_USERNAME, VALID_PASSWORD, Role.WORKER);
            when(authService.register(VALID_USERNAME, VALID_PASSWORD, Role.WORKER))
                    .thenThrow(new BadRequestException("User already exists"));

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }
    }
}