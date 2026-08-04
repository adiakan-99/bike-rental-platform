package com.bikerental.auth_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bikerental.auth_service.entity.UserRole;
import com.bikerental.auth_service.entity.UserRoleId;

@Repository
public interface UserRoleRepository
		extends
			JpaRepository<UserRole, UserRoleId> {

}
