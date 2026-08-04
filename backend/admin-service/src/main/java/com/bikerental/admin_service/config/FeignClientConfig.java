package com.bikerental.admin_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import feign.RequestInterceptor;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class FeignClientConfig {

	@Bean
	public RequestInterceptor requestInterceptor() {

		return template -> {

			ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
					.getRequestAttributes();

			if (attributes != null) {
				HttpServletRequest request = attributes.getRequest();
				String authorization = request.getHeader("Authorization");

				System.out.println("FEIGN INTERCEPTOR: Found token? "
						+ (authorization != null)); // ADD THIS

				if (authorization != null) {
					template.header("Authorization", authorization);
				}
			} else {
				System.out.println(
						"FEIGN INTERCEPTOR: Context is NULL! Thread lost."); // ADD
																				// THIS
			}
		};
	}

}
