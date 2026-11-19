
package com.campuspulse.backend.controller;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.campuspulse.backend.service.PostgresService;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "https://campus-pulse-frontend-seven.vercel.app"
})
public class EventController {

    private static final String TOPIC_NAME = "campus-events";

    private static final Set<String> VALID_ZONES =
            Set.of("Library", "Canteen", "Lab");

    private static final Set<String> VALID_EVENT_TYPES =
            Set.of("check_in", "check_out");

    private final PostgresService postgresService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public EventController(
            PostgresService postgresService,
            KafkaTemplate<String, Object> kafkaTemplate) {

        this.postgresService = postgresService;
        this.kafkaTemplate = kafkaTemplate;
    }

    // Existing endpoint: retrieve events
    @GetMapping("/api/events")
    public Object getEvents() {
        return postgresService.getEvents();
    }

    // New endpoint: receive and publish mobile events
    @PostMapping("/api/events")
    public ResponseEntity<?> createEvent(
            @RequestBody Map<String, Object> event) {

        String eventId = (String) event.get("event_id");
        String studentId = (String) event.get("student_id");
        String zone = (String) event.get("zone");
        String eventType = (String) event.get("event_type");
        String timestamp = (String) event.get("timestamp");

        if (eventId == null || eventId.isBlank()
                || studentId == null || studentId.isBlank()
                || zone == null
                || eventType == null
                || timestamp == null) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Missing or invalid required fields"));
        }

        if (!VALID_ZONES.contains(zone)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid zone: " + zone));
        }

        if (!VALID_EVENT_TYPES.contains(eventType)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid event type"));
        }

        try {
            Instant.parse(timestamp);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid timestamp"));
        }

        try {
            kafkaTemplate.send(TOPIC_NAME, zone, event)
                    .get(10, TimeUnit.SECONDS);

            return ResponseEntity.accepted().body(
                    Map.of(
                            "status", "accepted",
                            "event_id", eventId,
                            "message", "Event published to Kafka"
                    )
            );

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();

            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Event publishing interrupted"));

        } catch (Exception e) {

            e.printStackTrace();

            Throwable rootCause = e;

            while (rootCause.getCause() != null) {
                rootCause = rootCause.getCause();
            }

            System.err.println("KAFKA ROOT CAUSE: " + rootCause);

            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "error", "Failed to publish event",
                    "details", rootCause.toString()
            ));
        }
    }
}
