package com.bikerental.admin_service.filter;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.bikerental.admin_service.security.JwtService;
import com.bikerental.admin_service.security.JwtUser;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtService jwtService;

	@Override
	protected void doFilterInternal(HttpServletRequest request,
			HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String authHeader = request.getHeader("Authorization");

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {

			filterChain.doFilter(request, response);
			return;
		}

		String token = authHeader.substring(7);

		try {

			if (jwtService.isTokenValid(token)) {

				Integer userId = jwtService.extractUserId(token);

				String email = jwtService.extractUsername(token);

				String firstName = jwtService.extractFirstName(token);

				String lastName = jwtService.extractFirstName(token);

				List<String> roles = jwtService.extractRoles(token);

				JwtUser jwtUser = new JwtUser(userId, email, email, firstName,
						lastName, roles);

				List<SimpleGrantedAuthority> authorities = roles.stream()
						.map(role -> new SimpleGrantedAuthority("ROLE_" + role))
						.toList();

				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
						jwtUser, null, authorities);

				SecurityContextHolder.getContext()
						.setAuthentication(authentication);
			}

		} catch (Exception e) {

			SecurityContextHolder.clearContext();
		}

		filterChain.doFilter(request, response);
	}
}