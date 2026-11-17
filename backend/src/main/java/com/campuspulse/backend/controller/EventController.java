package com.campuspulse.backend.controller;

import com.campuspulse.backend.service.PostgresService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    private final PostgresService postgresService;

    public EventController(PostgresService postgresService) {
        this.postgresService = postgresService;
    }

    @GetMapping("/api/events")
    public Object getEvents() {
        return postgresService.getEvents();
    }
}