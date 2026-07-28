package com.bikerental.customer_service.exception;

public class CustomerAlreadyExistsException extends RuntimeException {

    public CustomerAlreadyExistsException(Integer userId) {
        super("Customer profile already exists for user id: " + userId);
    }

}