package com.bilalsaaoud.jobpilot.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/** Profil du candidat, charge depuis resources/profile.json au demarrage. */
@Component
public class CandidateProfile {

    /** Structure brute du fichier profile.json (deserialisee par Jackson, sans recursion). */
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class ProfileData {
        public String fullName, title, email, phone, school, diploma,
                availability, location, portfolio, rhythmPitch;
        public List<String> skills, learning;
    }

    private final ProfileData data;

    public CandidateProfile() {
        try (InputStream in = new ClassPathResource("profile.json").getInputStream()) {
            this.data = new ObjectMapper().readValue(in, ProfileData.class);
        } catch (Exception e) {
            throw new IllegalStateException("Impossible de charger profile.json", e);
        }
    }

    /** Ensemble des competences en minuscules pour comparaison. */
    public Set<String> skillSet() {
        return data.skills == null ? Set.of()
                : data.skills.stream().map(String::toLowerCase)
                    .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    public Set<String> learningSet() {
        return data.learning == null ? Set.of()
                : data.learning.stream().map(String::toLowerCase)
                    .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    public String getFullName() { return data.fullName; }
    public String getTitle() { return data.title; }
    public String getEmail() { return data.email; }
    public String getPhone() { return data.phone; }
    public String getSchool() { return data.school; }
    public String getDiploma() { return data.diploma; }
    public String getAvailability() { return data.availability; }
    public String getLocation() { return data.location; }
    public String getPortfolio() { return data.portfolio; }
    public String getRhythmPitch() { return data.rhythmPitch; }
    public List<String> getSkills() { return data.skills; }
    public List<String> getLearning() { return data.learning; }
}
