package com.bilalsaaoud.jobpilot.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.*;

/** Registre des domaines métiers (chargé depuis domains.json). */
@Component
public class DomainRegistry {

    public static class Domain {
        public String id, label, emoji;
        public List<String> skills = new ArrayList<>();
        public List<String> roles = new ArrayList<>();
        public List<String> profileSkills = new ArrayList<>();
    }

    private final Map<String, Domain> byId = new LinkedHashMap<>();
    private final TechDictionary techDictionary;

    public DomainRegistry(TechDictionary techDictionary) {
        this.techDictionary = techDictionary;
        try (InputStream in = new ClassPathResource("domains.json").getInputStream()) {
            Domain[] arr = new ObjectMapper().readValue(in, Domain[].class);
            for (Domain d : arr) byId.put(d.id, d);
        } catch (Exception e) {
            throw new IllegalStateException("Impossible de charger domains.json", e);
        }
    }

    public Collection<Domain> all() { return byId.values(); }

    public Domain get(String id) {
        return byId.getOrDefault(id, byId.get("informatique"));
    }

    /** Compétences citées dans le texte pour le domaine donné. */
    public Set<String> extract(String domainId, String text) {
        if ("informatique".equals(domainId)) return techDictionary.extract(text);
        Domain d = get(domainId);
        if (text == null || text.isBlank()) return Set.of();
        String t = " " + text.toLowerCase() + " ";
        Set<String> found = new LinkedHashSet<>();
        for (String s : d.skills) {
            if (t.contains(s.toLowerCase())) found.add(s.toLowerCase());
        }
        return found;
    }

    /** Compétences par défaut du profil pour un domaine (utilisées si l'utilisateur n'en fournit pas). */
    public Set<String> defaultProfileSkills(String domainId) {
        Set<String> out = new LinkedHashSet<>();
        for (String s : get(domainId).profileSkills) out.add(s.toLowerCase());
        return out;
    }
}
