package com.example.cafe_system.exceptions;

public class ReferenceNotFoundException extends RuntimeException {
    public ReferenceNotFoundException(String message) {
        super(message);
    }
}
