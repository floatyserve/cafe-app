package com.example.cafe_system.exceptions;

import com.example.cafe_system.exceptions.api.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ReferenceNotFoundException.class)
    public ResponseEntity<ApiError> handleReferenceNotFoundException(ReferenceNotFoundException e) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(
                        new ApiError(
                                "NOT_FOUND",
                                e.getMessage()
                        )
                );
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> handleBadRequestException(BadRequestException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        new ApiError(
                                "BAD_REQUEST",
                                e.getMessage()
                        )
                );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRuntimeException(RuntimeException e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(
                        new ApiError(
                                "INTERNAL_SERVER_ERROR",
                                e.getMessage()
                        )
                );
    }
}
