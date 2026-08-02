package com.bikerental.bike_service.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI customOpenAPI() {

		final String securitySchemeName = "Bearer Authentication";

		return new OpenAPI()

				// Fixed title to match Bike Service
				.info(new Info().title("Bike Rental Bike Service API")
						.version("1.0").description("Bike Service APIs"))

				// Servers correctly pointing to Gateway (8080) and Bike Service
				// direct port (8084)
				.servers(List.of(
						new Server().url("http://localhost:8080")
								.description("API Gateway"),
						new Server().url("http://localhost:8084")
								.description("Direct Service")))

				.addSecurityItem(
						new SecurityRequirement().addList(securitySchemeName))

				.schemaRequirement(securitySchemeName,

						new SecurityScheme().name(securitySchemeName)
								.type(SecurityScheme.Type.HTTP).scheme("bearer")
								.bearerFormat("JWT"));
	}
}