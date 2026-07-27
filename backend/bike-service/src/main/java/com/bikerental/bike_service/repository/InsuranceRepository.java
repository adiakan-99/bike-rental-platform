package com.bikerental.bike_service.repository;

import com.bikerental.bike_service.entity.Insurance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsuranceRepository extends JpaRepository<Insurance, Integer> {
}