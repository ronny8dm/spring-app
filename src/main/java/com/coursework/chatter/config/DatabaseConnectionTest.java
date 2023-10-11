package com.coursework.chatter.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Service
public class DatabaseConnectionTest {

    private final DataSource dataSource;

    @Autowired
    public DatabaseConnectionTest(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void testConnection() throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            if (connection != null && !connection.isClosed()) {
                System.out.println("Successfully connected to the database.");
            } else {
                System.err.println("Failed to connect to the database.");
            }
        }
    }
}
