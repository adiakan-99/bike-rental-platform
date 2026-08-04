package com.bikerental.admin_service.security;

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

	private String lastName;

	private List<String> roles;
}