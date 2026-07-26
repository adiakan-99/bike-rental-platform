package com.bikerental.auth_service.service;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bikerental.auth_service.dto.LoginRequest;
import com.bikerental.auth_service.dto.LoginResponse;
import com.bikerental.auth_service.dto.RegisterRequest;
import com.bikerental.auth_service.dto.RegisterResponse;
import com.bikerental.auth_service.entity.Role;
import com.bikerental.auth_service.entity.User;
import com.bikerental.auth_service.entity.UserRole;
import com.bikerental.auth_service.entity.UserRoleId;
import com.bikerental.auth_service.enums.AccountStatus;
import com.bikerental.auth_service.enums.KycStatus;
import com.bikerental.auth_service.repository.RoleRepository;
import com.bikerental.auth_service.repository.UserRepository;
import com.bikerental.auth_service.repository.UserRoleRepository;

import jakarta.transaction.Transactional;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

	private final AuthenticationManager authenticationManager;

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final RoleRepository roleRepository;

	private final UserRoleRepository userRoleRepository;

	private final JwtService jwtService;

	public AuthenticationServiceImpl(AuthenticationManager authenticationManager, UserRepository userRepository,
			PasswordEncoder passwordEncoder, RoleRepository roleRepository, UserRoleRepository userRoleRepository,
			JwtService jwtService) {
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.roleRepository = roleRepository;
		this.userRoleRepository = userRoleRepository;
		this.jwtService = jwtService;
	}

	@Override
	public LoginResponse login(LoginRequest request) {
		// TODO Auto-generated method stub

		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("Invalid email or password"));

		if (user.getAccountStatus() != AccountStatus.ACTIVE) {
			throw new RuntimeException("Account is disabled or suspended");
		}

		String token = jwtService.generateToken(user);

		return new LoginResponse("Login Successful", token, user.getEmail());

	}

	@Transactional
	@Override
	public RegisterResponse register(RegisterRequest request) {

		if (userRepository.existsByEmail(request.getEmail())) {
			throw new RuntimeException("Email Already registered");
		}

		User user = new User();

		user.setEmail(request.getEmail());

		user.setPassword(passwordEncoder.encode(request.getPassword()));

		user.setPhoneNumber(request.getPhoneNumber());

		user.setFirstName(request.getFirstName());

		user.setLastName(request.getLastName());

		user.setGender(request.getGender());

		user.setAccountStatus(AccountStatus.ACTIVE);

		user.setKycStatus(KycStatus.PENDING);

		user.setCreatedAt(LocalDateTime.now());

		User savedUser = userRepository.save(user);

		// find Customer role
		Role customerRole = roleRepository.findByName("CUSTOMER")
				.orElseThrow(() -> new RuntimeException("Role not Found"));

		UserRole userRole = new UserRole();
		userRole.setId(new UserRoleId(savedUser.getUserId(), customerRole.getRoleId()));
		userRole.setUser(savedUser);
		userRole.setRole(customerRole);
		userRole.setAssignedAt(LocalDateTime.now());

		// save mapping
		userRoleRepository.save(userRole);

		return new RegisterResponse(savedUser.getUserId(), savedUser.getEmail(), savedUser.getFirstName(),
				savedUser.getLastName(), savedUser.getPhoneNumber(), "Registration Successful");

	}

}
