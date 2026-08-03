package com.bikerental.auth_service.security;

import java.util.Collection;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.bikerental.auth_service.entity.User;

public class CustomUserDetails implements UserDetails {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final User user;

	public CustomUserDetails(User user) {
		this.user = user;
	}

	public Integer getUserId() {
		return user.getUserId();
	}

	public void setUserId(Integer userId) {
		user.setUserId(userId);
	}

	@Override
	public String getUsername() {

		return user.getEmail();
	}

	@Override
	public @Nullable String getPassword() {
		return user.getPassword();
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return user.getUserRoles().stream().map(
				role -> new SimpleGrantedAuthority("ROLE_" + role.getRole()))
				.toList();
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}

}
