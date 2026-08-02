package com.bikerental.customer_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI customOpenAPI() {

		final String securitySchemeName = "Bearer Authentication";

		return new OpenAPI()

				.info(new Info().title("Bike Rental Customer Service API")
						.version("1.0").description("Customer Service APIs"))

				// Add Gateway and Direct URLs explicitly
				.servers(List.of(
						new Server().url("http://localhost:8080")
								.description("API Gateway"),
						new Server().url("http://localhost:8082")
								.description("Direct Service")))

				.addSecurityItem(
						new SecurityRequirement().addList(securitySchemeName))

				.schemaRequirement(securitySchemeName,

						new SecurityScheme().name(securitySchemeName)
								.type(SecurityScheme.Type.HTTP).scheme("bearer")
								.bearerFormat("JWT"));
	}
}