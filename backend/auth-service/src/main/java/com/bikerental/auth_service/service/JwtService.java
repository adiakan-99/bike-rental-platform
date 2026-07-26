package com.bikerental.auth_service.service;

import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.bikerental.auth_service.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${jwt.secret}")
	private String secretKey;

	@Value("${jwt.expiration}")
	private long jwtExpiration;

	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(secretKey.getBytes());
	}

	private boolean isTokenExpired(String token) {

		return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload().getExpiration()
				.before(new Date());
	}

	private Claims extractClaims(String token) {
		return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
	}

	public String generateToken(User user) {

		Set<String> roles = user.getUserRoles().stream()
				.map(userRole -> userRole.getRole().getName())
				.collect(Collectors.toSet());

		return Jwts.builder().subject(user.getEmail()).claim("userId", user.getUserId()).claim("roles", roles)
				.claim("firstName", user.getFirstName()).issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + jwtExpiration)).signWith(getSigningKey()).compact();

	}

	public String extractUsername(String token) {

		return extractClaims(token).getSubject();

	}

	public boolean isValid(String token, UserDetails userDetails) {

		try {

			String username = extractUsername(token);

			return username.equals(userDetails.getUsername()) && !isTokenExpired(token);

		} catch (Exception e) {
			return false;
		}
	}

}
