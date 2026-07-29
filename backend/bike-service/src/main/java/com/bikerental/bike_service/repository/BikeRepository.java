package com.bikerental.bike_service.repository;

import com.bikerental.bike_service.entity.Bike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BikeRepository extends JpaRepository<Bike, Integer> {
    List<Bike> findByPartnerIdAndDeletedAtIsNull(Integer partnerId);
    boolean existsByRegistrationNumber(String registrationNumber);
}