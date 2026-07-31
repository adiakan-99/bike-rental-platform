package com.bikerental.bike_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "bike_details", uniqueConstraints = {
        @UniqueConstraint(name = "bike_details_bike_id_key", columnNames = {"bike_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BikeDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bike_details_id")
    private Integer bikeDetailsId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bike_id", nullable = false)
    private Bike bike;

    @Column(name = "bike_category", nullable = false)
    private String bikeCategory; // e.g., SCOOTER, COMMUTER, SPORTS

    @Column(name = "bike_type", nullable = false)
    private String bikeType;

    @Column(name = "engine_cc")
    private Integer engineCc;

    @Column(name = "transmission", nullable = false)
    private String transmission; // MANUAL, AUTOMATIC

    @Column(name = "seating_capacity", nullable = false)
    private Integer seatingCapacity;

    @Column(name = "year_of_manufacture", nullable = false)
    private Integer yearOfManufacture;

    @Column(name = "color")
    private String color;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "additional_specs", columnDefinition = "jsonb")
    private Map<String, Object> additionalSpecs;
}