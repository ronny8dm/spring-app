package com.coursework.chatter;

import com.coursework.chatter.config.DatabaseConnectionTest;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.sql.SQLException;
import java.util.Objects;

@SpringBootApplication
public class ChatterApplication {

	static {
		// Load .env variables
		Dotenv dotenv = Dotenv.load();
		System.out.println("DB_URL: " + dotenv.get("DB_URL"));  // Debug log
		System.setProperty("DB_URL", Objects.requireNonNull(dotenv.get("DB_URL")));
		System.setProperty("DB_USERNAME", Objects.requireNonNull(dotenv.get("DB_USERNAME")));
		System.setProperty("DB_PASSWORD", Objects.requireNonNull(dotenv.get("DB_PASSWORD")));
		System.setProperty("DB_DRIVER", Objects.requireNonNull(dotenv.get("DB_DRIVER")));
	}

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(ChatterApplication.class, args);
		DatabaseConnectionTest dbTest = context.getBean(DatabaseConnectionTest.class);
		try {
			dbTest.testConnection();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}

