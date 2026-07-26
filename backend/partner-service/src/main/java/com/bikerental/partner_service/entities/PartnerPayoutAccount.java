package com.bikerental.partner_service.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "partner_payout_account", schema = "public")
public class PartnerPayoutAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payout_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "partner_id", nullable = false)
    private Partner partner;

    @Size(max = 150)
    @NotNull
    @Column(name = "account_holder", nullable = false, length = 150)
    private String accountHolder;

    @Size(max = 30)
    @NotNull
    @Column(name = "account_number", nullable = false, length = 30)
    private String accountNumber;

    @Size(max = 11)
    @NotNull
    @Column(name = "ifsc", nullable = false, length = 11)
    private String ifsc;

    @Size(max = 150)
    @Column(name = "bank_name", length = 150)
    private String bankName;

    @NotNull
    @ColumnDefault("true")
    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary;

    @Column(name = "verified_at")
    private OffsetDateTime verifiedAt;

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;


}