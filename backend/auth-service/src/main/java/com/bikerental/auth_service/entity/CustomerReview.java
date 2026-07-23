package com.bikerental.auth_service.entity;

import java.time.LocalDateTime;

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
@Table(name = "customer_review")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerReview {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "review_id")
	private Integer reviewId;

	@OneToOne
	@JoinColumn(name = "booking_id", nullable = false, unique = true)
	private BikeBookingDetails booking;

	@Column(name = "bike_rating", nullable = false)
	private Integer bikeRating;

	@Column(name = "partner_rating", nullable = false)
	private Integer partnerRating;

	private String title;
	private String comment;
	private String pros;
	private String cons;

	@Column(name = "helpful_count", nullable = false)
	private Integer helpfulCount = 0;

	@Column(name = "is_anonymous", nullable = false)
	private Boolean isAnonymous = false;

	@Column(name = "partner_reply")
	private String partnerReply;

	@Column(name = "replied_at")
	private LocalDateTime repliedAt;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	private Integer performance;

	@Column(name = "bike_condition")
	private Integer bikeCondition;

	private Integer cleanliness;
}