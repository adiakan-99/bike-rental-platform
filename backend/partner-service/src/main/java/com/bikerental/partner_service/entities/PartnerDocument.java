package com.bikerental.partner_service.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "partner_document", schema = "public", indexes = {@Index(name = "partner_document_type_idx",
        columnList = "partner_id, doc_type")})
public class PartnerDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "partner_id", nullable = false)
    private Partner partner;

    @Size(max = 40)
    @NotNull
    @Column(name = "doc_type", nullable = false, length = 40)
    private String docType;

    @Size(max = 500)
    @NotNull
    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;

    @Column(name = "expires_at")
    private LocalDate expiresAt;

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "uploaded_at", nullable = false)
    private OffsetDateTime uploadedAt;


}