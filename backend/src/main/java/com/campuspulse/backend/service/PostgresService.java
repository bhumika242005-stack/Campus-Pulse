package com.campuspulse.backend.service;

import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PostgresService {

    private static final String URL =
            "jdbc:postgresql://localhost:5432/campus_pulse";

    private static final String USER = "campus";
    private static final String PASSWORD = "campus123";

    public List<Map<String, Object>> getEvents() {

        List<Map<String, Object>> events = new ArrayList<>();

        String sql = """
                SELECT id, event_id, student_id, zone, event_type, timestamp
                FROM events
                ORDER BY timestamp DESC
                LIMIT 100
                """;

        try (
                Connection connection =
                        DriverManager.getConnection(URL, USER, PASSWORD);

                PreparedStatement statement =
                        connection.prepareStatement(sql);

                ResultSet resultSet =
                        statement.executeQuery()
        ) {

            while (resultSet.next()) {

                Map<String, Object> event = new LinkedHashMap<>();

                event.put("id", resultSet.getInt("id"));
                event.put("event_id", resultSet.getString("event_id"));
                event.put("student_id", resultSet.getString("student_id"));
                event.put("zone", resultSet.getString("zone"));
                event.put("event_type", resultSet.getString("event_type"));
                event.put("timestamp", resultSet.getTimestamp("timestamp"));

                events.add(event);
            }

        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch events from PostgreSQL", e);
        }

        return events;
    }
}