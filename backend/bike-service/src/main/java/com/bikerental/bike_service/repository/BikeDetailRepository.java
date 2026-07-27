package com.bikerental.bike_service.repository;

import com.bikerental.bike_service.entity.BikeDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BikeDetailRepository extends JpaRepository<BikeDetail, Integer> {
}