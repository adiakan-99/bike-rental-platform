package com.bikerental.partner_service.repositories;

import com.bikerental.partner_service.entities.PartnerDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartnerDocumentRepository extends JpaRepository<PartnerDocument, Integer> {
    List<PartnerDocument> findByPartnerId(Integer partnerId);
}