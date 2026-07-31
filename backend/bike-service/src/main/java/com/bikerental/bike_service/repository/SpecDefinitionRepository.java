package com.bikerental.bike_service.repository;

import com.bikerental.bike_service.entity.SpecDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecDefinitionRepository extends JpaRepository<SpecDefinition, Integer> {
}