package com.bikerental.bike_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "spec_definition", uniqueConstraints = {
        @UniqueConstraint(name = "spec_definition_unique_0", columnNames = {"bike_category", "spec_key"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spec_id")
    private Integer specId;

    @Column(name = "bike_category", nullable = false)
    private String bikeCategory;

    @Column(name = "spec_key", nullable = false)
    private String specKey;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "data_type", nullable = false)
    private String dataType; // STRING, NUMBER, BOOLEAN

    @Column(name = "unit")
    private String unit;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired;

    @PrePersist
    protected void onCreate() {
        if (this.isRequired == null) {
            this.isRequired = false;
        }
    }
}