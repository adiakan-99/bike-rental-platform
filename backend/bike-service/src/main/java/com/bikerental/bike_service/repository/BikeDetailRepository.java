package com.bikerental.bike_service.repository;

import com.bikerental.bike_service.entity.BikeDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BikeDetailRepository extends JpaRepository<BikeDetails, Integer> {
}