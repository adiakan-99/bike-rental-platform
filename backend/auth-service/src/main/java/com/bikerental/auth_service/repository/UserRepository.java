package com.bikerental.auth_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bikerental.auth_service.entity.User;
import com.bikerental.auth_service.enums.AccountStatus;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	Optional<User> findByEmail(String email);

	Boolean existsByEmail(String email);

	long count();

	long countByAccountStatus(AccountStatus accountStatus);

}
