package com.buildgenie.service;

import com.buildgenie.dto.ForecastRequest;
import com.buildgenie.dto.PredictionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientResponseException;

@Service
public class ForecastService {

    private static final Logger log = LoggerFactory.getLogger(ForecastService.class);

    private final RestTemplate restTemplate;

    @Value("${ai.forecast.service.url}")
    private String aiServiceUrl;

    public ForecastService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private String resolvePredictUrl(String base) {
        if (base == null || base.isEmpty()) {
            return "/predict";
        }
        String trimmed = base.trim();
        if (trimmed.endsWith("/predict")) {
            return trimmed;
        }
        if (trimmed.endsWith("/")) {
            return trimmed + "predict";
        }
        return trimmed + "/predict";
    }

    public PredictionResponse getPrediction(ForecastRequest request) {
        try {
            String predictUrl = resolvePredictUrl(aiServiceUrl);
            if (!predictUrl.equals(aiServiceUrl)) {
                log.warn("Normalized AI URL from '{}' to '{}'. Ensure env var includes '/predict'.", aiServiceUrl, predictUrl);
            }
            log.info("Requesting AI prediction at {}", predictUrl);
            log.debug("ForecastRequest payload: cpuModel={}, cpuBoostClockGhz={}, gpuModel={}, gpuVramGb={}, ramSizeGb={}, ramSpeedMhz={}, storageType={}",
                    request.getCpuModel(),
                    request.getCpuBoostClockGhz(),
                    request.getGpuModel(),
                    request.getGpuVramGb(),
                    request.getRamSizeGb(),
                    request.getRamSpeedMhz(),
                    request.getStorageType());
            ResponseEntity<PredictionResponse> response =
                    restTemplate.postForEntity(predictUrl, request, PredictionResponse.class);
            PredictionResponse body = response.getBody();
            if (body == null) {
                log.warn("AI service returned empty body with status {}", response.getStatusCode());
                return new PredictionResponse(0.0, 0.0, "N/A");
            }
            log.info("AI prediction response: fps={}, benchmark={}, rating={}",
                    body.getPredictedFps(), body.getBenchmarkScore(), body.getPerformanceRating());
            return body;
        } catch (RestClientResponseException e) {
            log.error("AI service call failed: status={} body={}", e.getRawStatusCode(), e.getResponseBodyAsString());
            return new PredictionResponse(0.0, 0.0, "N/A");
        } catch (Exception e) {
            log.error("Failed to get prediction from AI service: {}", e.getMessage(), e);
            PredictionResponse fallback = new PredictionResponse(0.0, 0.0, "N/A");
            return fallback;
        }
    }
}