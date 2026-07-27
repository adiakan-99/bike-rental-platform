package com.bikerental.bike_service.repository;

import com.bikerental.bike_service.entity.Bike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BikeRepository extends JpaRepository<Bike, Integer> {
}