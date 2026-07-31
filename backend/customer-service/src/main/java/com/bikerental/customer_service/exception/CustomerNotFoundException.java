package com.bikerental.customer_service.exception;

public class CustomerNotFoundException extends RuntimeException {

    public CustomerNotFoundException(Integer userId) {
        super("Customer not found for user id : " + userId);
    }
}