package com.bikerental.customer_service.exception;

public class CustomerAlreadyExistsException extends RuntimeException {

    public CustomerAlreadyExistsException(Integer userId) {
        super("Customer already exists for user id : " + userId);
    }
}