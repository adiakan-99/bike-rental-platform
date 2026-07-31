package com.bikerental.customer_service.exception;

public class UserKycAlreadyExistsException extends RuntimeException {
  public UserKycAlreadyExistsException(String message) {
    super(message);
  }
}
