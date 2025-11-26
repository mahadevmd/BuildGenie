package com.buildgenie.controller;

import com.buildgenie.dto.ForecastRequest;
import com.buildgenie.dto.PredictionResponse;
import com.buildgenie.service.ForecastService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forecast")
public class ForecastController {

    private final ForecastService forecastService;

    public ForecastController(ForecastService forecastService) {
        this.forecastService = forecastService;
    }

    @PostMapping
    public ResponseEntity<PredictionResponse> predict(@RequestBody ForecastRequest request) {
        PredictionResponse response = forecastService.getPrediction(request);
        return ResponseEntity.ok(response);
    }
}