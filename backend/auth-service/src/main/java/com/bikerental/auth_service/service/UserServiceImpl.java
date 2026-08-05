package com.bikerental.auth_service.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bikerental.auth_service.dto.AdminResponseDTO;
import com.bikerental.auth_service.dto.ChangePasswordRequest;
import com.bikerental.auth_service.dto.CreateAdminRequest;
import com.bikerental.auth_service.dto.ResetPasswordRequest;
import com.bikerental.auth_service.dto.UpdateProfileRequestDTO;
import com.bikerental.auth_service.dto.UpdateProfileResponseDTO;
import com.bikerental.auth_service.dto.UserProfileResponse;
import com.bikerental.auth_service.entity.PasswordResetToken;
import com.bikerental.auth_service.entity.Role;
import com.bikerental.auth_service.entity.User;
import com.bikerental.auth_service.entity.UserRole;
import com.bikerental.auth_service.entity.UserRoleId;
import com.bikerental.auth_service.enums.AccountStatus;
import com.bikerental.auth_service.exception.ResourceNotFoundException;
import com.bikerental.auth_service.repository.PasswordResetTokenRepository;
import com.bikerental.auth_service.repository.RoleRepository;
import com.bikerental.auth_service.repository.UserRepository;
import com.bikerental.auth_service.repository.UserRoleRepository;
import com.bikerental.auth_service.util.UserMapper;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final PasswordResetTokenRepository passwordResetTokenRepository;

	private final RoleRepository roleRepository;

	private final UserRoleRepository userRoleRepository;

	private final EmailService emailService;

	@Override
	public UserProfileResponse getUserById(Integer id) {
		// TODO Auto-generated method stub

		User user = userRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException("User not found"));

		return UserMapper.toDTO(user);
	}

	@Override
	public List<User> getAllUser() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deactivateUser(Integer id) {
		// TODO Auto-generated method stub

	}

	@Override
	public void updateUser(User user) {
		// TODO Auto-generated method stub

	}

	@Override
	public UserProfileResponse getCurrentUser(String email) {
		// TODO Auto-generated method stub
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found"));

		List<String> roles = user.getUserRoles().stream()
				.map(userRole -> userRole.getRole().getName()).toList();

		return new UserProfileResponse(

				user.getUserId(),

				user.getEmail(),

				user.getFirstName(),

				user.getLastName(),

				user.getPhoneNumber(),

				user.getGender(),

				user.getAccountStatus(),

				roles);
	}

	@Override
	public void changePassword(String email, ChangePasswordRequest request) {
		// TODO Auto-generated method stub
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not Found"));

		boolean passwordMatches = passwordEncoder
				.matches(request.getOldPassword(), user.getPassword());

		if (!passwordMatches) {
			throw new RuntimeException("Old password is incorrect");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));

		userRepository.save(user);

	}

	@Override
	public String forgotPassword(String email) {
		// TODO Auto-generated method stub
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException(email));

		String token = String.valueOf(100000 + new Random().nextInt(900000));

		PasswordResetToken resetToken = PasswordResetToken.builder()
				.token(token).user(user)
				.expiryTime(LocalDateTime.now().plusMinutes(15)).used(false)
				.createdAt(LocalDateTime.now()).build();

		passwordResetTokenRepository.save(resetToken);

		emailService.sendOtpEmail(user.getEmail(), token);

		return "OTP send Successfully";

	}

	@Override
	public void resetPassword(ResetPasswordRequest request) {
		// TODO Auto-generated method stub

		PasswordResetToken token = passwordResetTokenRepository
				.findByToken(request.getToken())
				.orElseThrow(() -> new RuntimeException("Invalid token"));

		if (token.getUsed()) {
			throw new RuntimeException("Token already used");
		}

		if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("Inavlid or Token expired.");
		}

		User user = token.getUser();

		if (passwordEncoder.matches(request.getNewPassword(),
				user.getPassword())) {
			throw new RuntimeException(
					"Old Password and New Password could not be same");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));

		userRepository.save(user);

		token.setUsed(true);

		passwordResetTokenRepository.save(token);

	}

	@Override
	public void addRole(Integer userId, String roleName) {

		User user = userRepository.findById(userId).orElseThrow(
				() -> new ResourceNotFoundException(" User Not Found"));

		Role role = roleRepository.findByName(roleName).orElseThrow(
				() -> new ResourceNotFoundException("Role Not found"));

		UserRoleId userRoleId = new UserRoleId(user.getUserId(),
				role.getRoleId());

		if (userRoleRepository.existsById(userRoleId)) {
			return;
		}

		UserRole userRole = new UserRole();
		userRole.setId(userRoleId);
		userRole.setRole(role);
		userRole.setUser(user);
		userRole.setAssignedAt(LocalDateTime.now());

		userRoleRepository.save(userRole);

	}

	@Override
	public void removeRole(Integer userId, String roleName) {

		User user = userRepository.findById(userId).orElseThrow(
				() -> new ResourceNotFoundException("User Does not Exists"));

		Role role = roleRepository.findByName(roleName).orElseThrow(
				() -> new ResourceNotFoundException("Role Not assigned"));

		UserRoleId userRoleId = new UserRoleId(user.getUserId(),
				role.getRoleId());

		userRoleRepository.deleteById(userRoleId);

	}

	@Override
	public void updateAccountStatus(Integer userId,
			AccountStatus accountStatus) {
		User user = userRepository.findById(userId).orElseThrow(
				() -> new ResourceNotFoundException("User Does not exists"));

		user.setAccountStatus(accountStatus);

		userRepository.save(user);

	}

	@Override
	public UpdateProfileResponseDTO updateProfile(Integer userId,
			UpdateProfileRequestDTO request) {
		// TODO Auto-generated method stub

		User user = userRepository.findById(userId).orElseThrow(
				() -> new UsernameNotFoundException("User not found"));

		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setPhoneNumber(request.getPhoneNumber());
		user.setGender(request.getGender());

		userRepository.save(user);

		UpdateProfileResponseDTO response = new UpdateProfileResponseDTO();

		response.setUserId(user.getUserId());
		response.setEmail(user.getEmail());
		response.setFirstName(user.getFirstName());
		response.setLastName(user.getLastName());
		response.setPhoneNumber(user.getPhoneNumber());
		response.setGender(user.getGender());

		return response;
	}

	@Transactional
	@Override
	public AdminResponseDTO createAdmin(CreateAdminRequest request) {

		if (userRepository.existsByEmail(request.getEmail())) {
			throw new RuntimeException("Email already exists");
		}

		User user = new User();

		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setEmail(request.getEmail());
		user.setPhoneNumber(request.getPhoneNumber());

		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setCreatedAt(LocalDateTime.now());

		user.setAccountStatus(AccountStatus.ACTIVE);

		userRepository.save(user);

		Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();

		UserRole userRole = new UserRole();

		UserRoleId userRoleId = new UserRoleId();

		userRoleId.setUserId(user.getUserId());
		userRoleId.setRoleId(adminRole.getRoleId());

		userRole.setId(userRoleId);

		userRole.setUser(user);
		userRole.setRole(adminRole);
		userRole.setAssignedAt(LocalDateTime.now());
		userRole.setAssignedBy(user);

		userRoleRepository.save(userRole);

		return mapToAdminResponse(user);

	}

	private AdminResponseDTO mapToAdminResponse(User user) {
		// TODO Auto-generated method stub

		AdminResponseDTO response = new AdminResponseDTO();

		response.setAccountStatus(user.getAccountStatus());
		response.setCreatedAt(user.getCreatedAt());
		response.setEmail(user.getEmail());
		response.setFirstName(user.getFirstName());
		response.setLastName(user.getLastName());
		response.setPhoneNumber(user.getPhoneNumber());
		response.setUserId(user.getUserId());

		return response;
	}

	@Override
	public List<AdminResponseDTO> getAllAdmins() {
		// TODO Auto-generated method stub
		return userRepository.findByUserRoles_Role_Name("ADMIN").stream()
				.map(this::mapToAdminResponse).toList();
	}

}
