package com.buildgenie.service;

import com.buildgenie.dto.ForecastRequest;
import com.buildgenie.dto.PredictionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ForecastService {

    private static final Logger log = LoggerFactory.getLogger(ForecastService.class);

    private final RestTemplate restTemplate;

    @Value("${ai.forecast.service.url}")
    private String aiServiceUrl;

    public ForecastService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PredictionResponse getPrediction(ForecastRequest request) {
        try {
            ResponseEntity<PredictionResponse> response =
                    restTemplate.postForEntity(aiServiceUrl, request, PredictionResponse.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to get prediction from AI service", e);
            PredictionResponse fallback = new PredictionResponse(0.0, 0.0, "N/A");
            return fallback;
        }
    }
}