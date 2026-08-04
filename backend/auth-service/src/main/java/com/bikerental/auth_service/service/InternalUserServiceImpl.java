package com.bikerental.auth_service.service;

import org.springframework.stereotype.Service;

import com.bikerental.auth_service.dto.UserDashboardStatsDTO;
import com.bikerental.auth_service.enums.AccountStatus;
import com.bikerental.auth_service.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class InternalUserServiceImpl implements InternalUserService {

	UserRepository userRepository;

	@Override
	public UserDashboardStatsDTO getDashboardStats() {
		return new UserDashboardStatsDTO(userRepository.count(),
				userRepository.countByAccountStatus(AccountStatus.BLOCKED));
	};

}
