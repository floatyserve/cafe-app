package com.example.cafe_system.exceptions.api;

public record ApiError(
        String code,
        String message
) {
}
