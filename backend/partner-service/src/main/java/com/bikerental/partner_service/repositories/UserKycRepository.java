package com.bikerental.partner_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserKycRepository extends JpaRepository<UserKyc, Integer> {
}