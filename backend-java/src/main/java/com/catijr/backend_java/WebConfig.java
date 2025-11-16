package com.catijr.backend_java;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    public void addCorsMapping(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins(
            "http://localhost:5173",
            "http://192.168.15.9:5173"
        ).allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS")
        .allowedHeaders("*").allowCredentials(true);
    }
}
