package com.example.demo.exception;

public class ConfirmationRequiredException extends RuntimeException {
    public ConfirmationRequiredException(String message) {
        super(message);
    }
}
