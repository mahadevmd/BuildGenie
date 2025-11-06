package com.buildgenie.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PredictionResponse {

    @JsonProperty("predicted_fps")
    private double predictedFps;

    @JsonProperty("benchmark_score")
    private double benchmarkScore;

    @JsonProperty("performance_rating")
    private String performanceRating;

    public PredictionResponse() {
    }

    public PredictionResponse(double predictedFps, double benchmarkScore, String performanceRating) {
        this.predictedFps = predictedFps;
        this.benchmarkScore = benchmarkScore;
        this.performanceRating = performanceRating;
    }

    public double getPredictedFps() {
        return predictedFps;
    }

    public void setPredictedFps(double predictedFps) {
        this.predictedFps = predictedFps;
    }

    public double getBenchmarkScore() {
        return benchmarkScore;
    }

    public void setBenchmarkScore(double benchmarkScore) {
        this.benchmarkScore = benchmarkScore;
    }

    public String getPerformanceRating() {
        return performanceRating;
    }

    public void setPerformanceRating(String performanceRating) {
        this.performanceRating = performanceRating;
    }
}