package com.example.cafe_system.integration;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public abstract class BaseIT {

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // Connecting to the local Docker container running on port 5433
        registry.add("spring.datasource.url", () -> "jdbc:postgresql://localhost:5433/cafe_db");
        registry.add("spring.datasource.username", () -> "postgres");
        registry.add("spring.datasource.password", () -> "postgres");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "update");
    }
}

