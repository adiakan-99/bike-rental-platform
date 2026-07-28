package com.bikerental.customer_service.repository;

import com.bikerental.customer_service.entity.UserRole;
import com.bikerental.customer_service.entity.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {
}