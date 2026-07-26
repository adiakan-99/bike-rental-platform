package com.bikerental.auth_service.service;

import com.bikerental.auth_service.dto.LoginRequest;
import com.bikerental.auth_service.dto.LoginResponse;
import com.bikerental.auth_service.dto.RegisterRequest;
import com.bikerental.auth_service.dto.RegisterResponse;

public interface AuthenticationService {

	RegisterResponse register(RegisterRequest request);

	LoginResponse login(LoginRequest request);
}
