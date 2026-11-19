
package com.campuspulse.backend.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PostgresService {

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String user;

    @Value("${spring.datasource.password}")
    private String password;

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
                        DriverManager.getConnection(url, user, password);

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

                OffsetDateTime timestamp =
                        resultSet.getObject("timestamp", OffsetDateTime.class);

                event.put("timestamp",
                        timestamp == null ? null : timestamp.toInstant().toString());

                events.add(event);
            }

        } catch (SQLException e) {
            throw new RuntimeException(
                    "Failed to fetch events from PostgreSQL", e);
        }

        return events;
    }
}
