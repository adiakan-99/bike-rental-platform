package com.bikerental.auth_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bike_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BikeDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bike_details_id")
	private Integer bikeDetailsId;

	@OneToOne
	@JoinColumn(name = "bike_id", nullable = false, unique = true)
	private Bike bike;

	@Column(name = "bike_category", nullable = false)
	private String bikeCategory;

	@Column(name = "bike_type", nullable = false)
	private String bikeType;

	@Column(name = "engine_cc")
	private Integer engineCc;

	@Column(nullable = false)
	private String transmission;

	@Column(name = "seating_capacity", nullable = false)
	private Integer seatingCapacity;

	@Column(name = "year_of_manufacture", nullable = false)
	private Integer yearOfManufacture;

	private String color;

	@Column(name = "additional_specs", columnDefinition = "jsonb")
	private String additionalSpecs;
}