package com.bikerental.customer_service.filter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.bikerental.customer_service.security.JwtUser;
import com.bikerental.customer_service.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

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

		if (!jwtService.isTokenValid(token)) {

			filterChain.doFilter(request, response);

			return;

		}

		try {
			Integer userId = jwtService.extractUserId(token);

			String email = jwtService.extractUsername(token);
        System.out.println("========== JWT FILTER ==========");
        System.out.println("Token: " + token);

        try {

            if (jwtService.isTokenValid(token)) {
            boolean valid = jwtService.isTokenValid(token);
            System.out.println("Token Valid: " + valid);

            if (valid) {
			String firstName = jwtService.extractFirstName(token);

			List<String> roles = jwtService.extractRoles(token);

			JwtUser jwtUser = new JwtUser(userId, email, firstName, roles);
                System.out.println("UserId: " + jwtUser.getUserId());
                System.out.println("Role: " + jwtUser.getRole());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                jwtUser,
                                null,
                                List.of(new SimpleGrantedAuthority(
                                        "ROLE_" + jwtUser.getRole()))
                        );

			List<SimpleGrantedAuthority> authorities = roles.stream()
					.map(role -> new SimpleGrantedAuthority("ROLE_" + role))
					.toList();
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

			UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
					jwtUser, null, authorities);

			SecurityContextHolder.getContext()
					.setAuthentication(authentication);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			SecurityContextHolder.clearContext();
		}

		filterChain.doFilter(request, response);

	}
        } catch (Exception e) {
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }
}