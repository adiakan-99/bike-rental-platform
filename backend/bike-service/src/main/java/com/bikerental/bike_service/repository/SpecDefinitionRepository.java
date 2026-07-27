package com.bikerental.bike_service.repository;

import com.bikerental.bike_service.entity.SpecDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpecDefinitionRepository extends JpaRepository<SpecDefinition, Integer> {
}