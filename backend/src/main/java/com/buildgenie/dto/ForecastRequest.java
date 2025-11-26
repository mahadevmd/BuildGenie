package com.buildgenie.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ForecastRequest {

    @JsonProperty("cpu_model")
    private String cpuModel;

    @JsonProperty("cpu_boost_clock_ghz")
    private double cpuBoostClockGhz;

    @JsonProperty("gpu_model")
    private String gpuModel;

    @JsonProperty("gpu_vram_gb")
    private int gpuVramGb;

    @JsonProperty("ram_size_gb")
    private int ramSizeGb;

    @JsonProperty("ram_speed_mhz")
    private int ramSpeedMhz;

    @JsonProperty("storage_type")
    private String storageType;

    public ForecastRequest() {
    }

    public String getCpuModel() {
        return cpuModel;
    }

    public void setCpuModel(String cpuModel) {
        this.cpuModel = cpuModel;
    }

    public double getCpuBoostClockGhz() {
        return cpuBoostClockGhz;
    }

    public void setCpuBoostClockGhz(double cpuBoostClockGhz) {
        this.cpuBoostClockGhz = cpuBoostClockGhz;
    }

    public String getGpuModel() {
        return gpuModel;
    }

    public void setGpuModel(String gpuModel) {
        this.gpuModel = gpuModel;
    }

    public int getGpuVramGb() {
        return gpuVramGb;
    }

    public void setGpuVramGb(int gpuVramGb) {
        this.gpuVramGb = gpuVramGb;
    }

    public int getRamSizeGb() {
        return ramSizeGb;
    }

    public void setRamSizeGb(int ramSizeGb) {
        this.ramSizeGb = ramSizeGb;
    }

    public int getRamSpeedMhz() {
        return ramSpeedMhz;
    }

    public void setRamSpeedMhz(int ramSpeedMhz) {
        this.ramSpeedMhz = ramSpeedMhz;
    }

    public String getStorageType() {
        return storageType;
    }

    public void setStorageType(String storageType) {
        this.storageType = storageType;
    }
}