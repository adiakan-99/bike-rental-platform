package com.bikerental.customer_service.repository;

import com.bikerental.customer_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}