package com.bikerental.customer_service.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Integer userId) {
        super("User not found with id : " + userId);
    }
}