package com.bikerental.bike_service.repository;

import com.bikerental.bike_service.entity.BikeImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BikeImageRepository extends JpaRepository<BikeImage, Integer> {
}