package com.bikerental.auth_service.security;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JwtUser {

    private Integer userId;

    private String email;

    private String username;

    private String firstName;

    private List<String> roles;
}