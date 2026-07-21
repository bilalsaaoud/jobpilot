package com.bilalsaaoud.jobpilot.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI jobPilotOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("JobPilot API")
                .version("1.0.0")
                .description("Assistant intelligent de recherche d'alternance : analyse d'offres, "
                        + "generation de mot de motivation, suivi des candidatures.")
                .contact(new Contact().name("Bilal Saaoud").email("bilal123saaoud@gmail.com")));
    }
}
