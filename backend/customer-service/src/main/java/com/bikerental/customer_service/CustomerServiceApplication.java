package com.bikerental.customer_service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@SpringBootApplication
public class CustomerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomerServiceApplication.class, args);
	}

	@Bean
    CommandLineRunner printMappings(RequestMappingHandlerMapping mapping) {
		return args -> mapping.getHandlerMethods().forEach((info, method) -> {
			if (info.toString().contains("/api/customers")) {
				System.out.println(info + " -> " + method);
			}
		});
	}
}
