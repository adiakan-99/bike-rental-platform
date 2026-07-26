package com.bikerental.partner_service.repositories;

import com.bikerental.partner_service.entities.PartnerPayoutAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PartnerPayoutAccountRepository extends JpaRepository<PartnerPayoutAccount, Integer> {
    Optional<PartnerPayoutAccount> findByPartnerId(Integer partnerId);
}