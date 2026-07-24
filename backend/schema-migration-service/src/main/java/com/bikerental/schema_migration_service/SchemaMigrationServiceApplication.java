package com.bikerental.schema_migration_service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class SchemaMigrationServiceApplication implements CommandLineRunner {

	private final ConfigurableApplicationContext context;

	public SchemaMigrationServiceApplication(ConfigurableApplicationContext context) {
		this.context = context;
	}

	public static void main(String[] args) {
		SpringApplication.run(SchemaMigrationServiceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		
		System.out.println("Flyway migration(s) successfully applied");
		
		int exitCode = SpringApplication.exit(context, () -> 0);
		System.exit(exitCode);
	}
	
	

}
