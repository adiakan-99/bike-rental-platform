package com.bikerental.bike_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Getter
@Setter
@Entity
@Table(name = "bike_details")
public class BikeDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bike_details_id", nullable = false)
    private Integer id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "bike_id", nullable = false)
    private Bike bike;

    @Size(max = 50)
    @NotNull
    @Column(name = "bike_category", nullable = false, length = 50)
    private String bikeCategory;

    @Size(max = 50)
    @NotNull
    @Column(name = "bike_type", nullable = false, length = 50)
    private String bikeType;

    @Column(name = "engine_cc")
    private Integer engineCc;

    @Size(max = 30)
    @NotNull
    @Column(name = "transmission", nullable = false, length = 30)
    private String transmission;

    @NotNull
    @Column(name = "seating_capacity", nullable = false)
    private Integer seatingCapacity;

    @NotNull
    @Column(name = "year_of_manufacture", nullable = false)
    private Integer yearOfManufacture;

    @Size(max = 50)
    @Column(name = "color", length = 50)
    private String color;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "additional_specs")
    private Map<String, Object> additionalSpecs;


}