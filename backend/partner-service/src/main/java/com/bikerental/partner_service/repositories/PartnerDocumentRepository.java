package com.bikerental.partner_service.repositories;

import com.bikerental.partner_service.entities.PartnerDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PartnerDocumentRepository extends JpaRepository<PartnerDocument, Integer> {
    List<PartnerDocument> findByPartnerId(Integer partnerId);

    Optional<PartnerDocument> findByPartnerIdAndDocType(Integer partnerId, String documentType);
}