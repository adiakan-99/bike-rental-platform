package com.bikerental.bike_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "spec_definition")
public class SpecDefinition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spec_id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "bike_category", nullable = false, length = 50)
    private String bikeCategory;

    @Size(max = 50)
    @NotNull
    @Column(name = "spec_key", nullable = false, length = 50)
    private String specKey;

    @Size(max = 100)
    @NotNull
    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @Size(max = 20)
    @NotNull
    @Column(name = "data_type", nullable = false, length = 20)
    private String dataType;

    @Size(max = 20)
    @Column(name = "unit", length = 20)
    private String unit;

    @NotNull
    @ColumnDefault("false")
    @Column(name = "is_required", nullable = false)
    private Boolean isRequired;


}