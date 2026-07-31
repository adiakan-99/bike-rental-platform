package com.bikerental.customer_service.filter;

import java.io.IOException;
import java.util.List;

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

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        System.out.println("========== JWT FILTER ==========");
        System.out.println("Token: " + token);

        try {

            boolean valid = jwtService.isTokenValid(token);
            System.out.println("Token Valid: " + valid);

            if (valid) {

                JwtUser jwtUser = new JwtUser(
                        jwtService.extractUserId(token),
                        jwtService.extractUsername(token),
                        jwtService.extractFirstName(token),
                        jwtService.extractRole(token)
                );

                System.out.println("UserId: " + jwtUser.getUserId());
                System.out.println("Role: " + jwtUser.getRole());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                jwtUser,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + jwtUser.getRole()))
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);

                System.out.println("Authentication set successfully");
            }

        } catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getMessage());
            e.printStackTrace();
        }
    }
}