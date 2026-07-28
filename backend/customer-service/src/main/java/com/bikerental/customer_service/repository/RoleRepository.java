package com.bikerental.customer_service.repository;

import com.bikerental.customer_service.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}