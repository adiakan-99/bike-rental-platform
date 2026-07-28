package com.bikerental.customer_service.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Integer userId) {
        super("User with id " + userId + " not found.");
    }

}