package com.buildgenie.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${cors.allowed-origins}")
    private String corsAllowedOrigins;

    @Value("${cors.allowed-origin-patterns:}")
    private String corsAllowedOriginPatterns;

    @SuppressWarnings("null")
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] origins = corsAllowedOrigins.split(",");
        String[] originPatterns = corsAllowedOriginPatterns != null ? corsAllowedOriginPatterns.split(",") : new String[]{};
        var mapping = registry.addMapping("/api/**")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
        if (originPatterns.length > 0) {
            mapping.allowedOriginPatterns(originPatterns);
        } else {
            mapping.allowedOrigins(origins);
        }
    }
}