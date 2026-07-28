package com.bikerental.customer_service.service;

import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${jwt.secret}")
	private String secretKey;

	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(secretKey.getBytes());
	}

	public Claims extractClaims(String token) {
		return Jwts.parser().verifyWith(getSigningKey()).build()
				.parseSignedClaims(token).getPayload();
	}

	public String extractUsername(String token) {
		return extractClaims(token).getSubject();
	}

	public Integer extractUserId(String token) {
		return extractClaims(token).get("userId", Integer.class);
	}

	public List<String> extractRoles(String token) {
		Claims claims = extractClaims(token);
		return claims.get("roles", List.class);
	}

	public String extractFirstName(String token) {
		return extractClaims(token).get("firstName", String.class);
	}

	public boolean isTokenValid(String token) {

		try {

			Date expiry = extractClaims(token).getExpiration();

			System.out.println("Expiry : " + expiry);

			return expiry.after(new Date());

		} catch (Exception e) {

			e.printStackTrace(); // <-- IMPORTANT

			return false;
		}
	}

}