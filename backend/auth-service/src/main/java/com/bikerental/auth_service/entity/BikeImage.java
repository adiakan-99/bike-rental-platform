package com.bikerental.auth_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bike_image")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BikeImage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bike_image_id")
	private Integer bikeImageId;

	@ManyToOne
	@JoinColumn(name = "bike_id", nullable = false)
	private Bike bike;

	@Column(name = "image_url", nullable = false)
	private String imageUrl;

	@Column(name = "display_order", nullable = false)
	private Integer displayOrder;

	@Column(name = "is_primary", nullable = false)
	private Boolean isPrimary;

	@Column(name = "uploaded_at", nullable = false)
	private LocalDateTime uploadedAt;
}