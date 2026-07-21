package com.bilalsaaoud.jobpilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * JobPilot — assistant intelligent de recherche d'alternance.
 * Analyse une offre, la compare au profil, genere un CV/mot adapte et suit les candidatures.
 */
@SpringBootApplication
public class JobPilotApplication {
    public static void main(String[] args) {
        SpringApplication.run(JobPilotApplication.class, args);
    }
}
