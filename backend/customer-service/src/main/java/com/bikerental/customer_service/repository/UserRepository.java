package com.bikerental.customer_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bikerental.customer_service.entity.Customer;

public interface UserRepository extends JpaRepository<Customer, Integer> {
}