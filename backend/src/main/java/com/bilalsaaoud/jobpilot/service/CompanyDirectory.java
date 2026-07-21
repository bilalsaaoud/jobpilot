package com.bilalsaaoud.jobpilot.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/** Annuaire d'entreprises pour l'autocomplétion (chargé depuis companies.json). */
@Component
public class CompanyDirectory {

    public record Company(String name, String sector, String city) {}

    private final List<Company> companies;

    public CompanyDirectory() {
        try (InputStream in = new ClassPathResource("companies.json").getInputStream()) {
            Company[] arr = new ObjectMapper().readValue(in, Company[].class);
            this.companies = List.of(arr);
        } catch (Exception e) {
            throw new IllegalStateException("Impossible de charger companies.json", e);
        }
    }

    /** Préfixe prioritaire, puis "contient". Renvoie au plus {limit} résultats. */
    public List<Company> search(String query, int limit) {
        if (query == null || query.isBlank()) return List.of();
        String q = query.trim().toLowerCase();
        List<Company> starts = new ArrayList<>();
        List<Company> contains = new ArrayList<>();
        for (Company c : companies) {
            String n = c.name().toLowerCase();
            if (n.startsWith(q)) starts.add(c);
            else if (n.contains(q)) contains.add(c);
        }
        starts.addAll(contains);
        return starts.size() > limit ? starts.subList(0, limit) : starts;
    }

    public int size() { return companies.size(); }
}
