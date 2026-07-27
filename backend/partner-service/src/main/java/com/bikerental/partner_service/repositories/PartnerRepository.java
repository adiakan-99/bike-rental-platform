package com.bikerental.partner_service.repositories;

import com.bikerental.partner_service.entities.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerRepository extends JpaRepository<Partner, Integer> {
    public boolean existsByUserId(Integer userId);
}