package com.bilalsaaoud.jobpilot.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Genere le contenu via un LLM compatible OpenAI. Actif uniquement si une cle API est fournie.
 * En cas d'erreur (reseau, quota...), il delegue au moteur par mots-cles : jamais de plantage.
 */
@Component
public class OpenAiAiClient implements AiClient {

    private static final Logger log = LoggerFactory.getLogger(OpenAiAiClient.class);

    private final String apiKey;
    private final String model;
    private final String baseUrl;
    private final KeywordAiClient fallback;
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10)).build();

    public OpenAiAiClient(
            @Value("${jobpilot.ai.openai.api-key:}") String apiKey,
            @Value("${jobpilot.ai.openai.model:gpt-4o-mini}") String model,
            @Value("${jobpilot.ai.openai.base-url:https://api.openai.com/v1}") String baseUrl,
            KeywordAiClient fallback) {
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = baseUrl;
        this.fallback = fallback;
    }

    public boolean isEnabled() { return apiKey != null && !apiKey.isBlank(); }

    @Override
    public GenerationResult generate(GenerationContext c) {
        if (!isEnabled()) return fallback.generate(c);
        try {
            String cover = chat(coverPrompt(c));
            String cv = chat(cvPrompt(c));
            return new GenerationResult(cover.strip(), cv.strip(), name());
        } catch (Exception e) {
            log.warn("LLM indisponible, bascule sur le moteur mots-cles : {}", e.getMessage());
            return fallback.generate(c);
        }
    }

    private String chat(String userPrompt) throws Exception {
        Map<String, Object> body = Map.of(
                "model", model,
                "temperature", 0.6,
                "messages", java.util.List.of(
                        Map.of("role", "system", "content",
                                "Tu es un coach carrière francophone. Tu écris des textes de candidature "
                                        + "professionnels, sincères et concis, sans exagérer."),
                        Map.of("role", "user", "content", userPrompt)));
        HttpRequest req = HttpRequest.newBuilder(URI.create(baseUrl + "/chat/completions"))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(45))
                .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
                .build();
        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() >= 300) throw new RuntimeException("HTTP " + resp.statusCode());
        JsonNode root = mapper.readTree(resp.body());
        return root.path("choices").get(0).path("message").path("content").asText();
    }

    private String coverPrompt(GenerationContext c) {
        var p = c.profile;
        return "Rédige un mot de motivation (150 mots max) pour une alternance.\n"
                + "Candidat : " + p.getFullName() + ", " + p.getDiploma() + " à l'" + p.getSchool()
                + ", disponible " + p.getAvailability() + ", basé en " + p.getLocation()
                + ", portfolio " + p.getPortfolio() + ".\n"
                + "Atout clé : " + p.getRhythmPitch() + "\n"
                + "Entreprise : " + orNa(c.company) + " | Poste : " + orNa(c.role) + "\n"
                + "Compétences en commun avec l'offre : " + join(c.matched) + "\n"
                + "Compétences de l'offre à apprendre : " + join(c.missing) + "\n"
                + "Reste honnête sur ce qui est à apprendre. Termine par la signature avec email et téléphone ("
                + p.getEmail() + " · " + p.getPhone() + ").";
    }

    private String cvPrompt(GenerationContext c) {
        return "À partir de cette analyse d'offre, donne des conseils courts et actionnables pour adapter un CV.\n"
                + "Compétences alignées : " + join(c.matched) + "\n"
                + "Compétences manquantes : " + join(c.missing) + "\n"
                + "Format : une section 'À METTRE EN AVANT' puis 'À AJOUTER OU TRAVAILLER', en puces.";
    }

    private String join(java.util.List<String> l) {
        return l.isEmpty() ? "(aucune)" : l.stream().collect(Collectors.joining(", "));
    }
    private String orNa(String s) { return (s == null || s.isBlank()) ? "(non précisé)" : s; }

    @Override public String name() { return "openai"; }
}
