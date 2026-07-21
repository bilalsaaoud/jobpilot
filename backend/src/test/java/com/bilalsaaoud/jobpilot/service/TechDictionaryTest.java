package com.bilalsaaoud.jobpilot.service;

import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class TechDictionaryTest {

    private final TechDictionary dict = new TechDictionary();

    @Test
    void extractsKnownTechnologies() {
        Set<String> found = dict.extract(
                "Développement en Java 17, Spring Boot, PostgreSQL et Angular. Tests JUnit, Docker et CI/CD.");
        assertThat(found).contains("java", "spring boot", "postgresql", "angular", "junit", "docker", "ci/cd");
    }

    @Test
    void emptyTextReturnsEmpty() {
        assertThat(dict.extract("")).isEmpty();
        assertThat(dict.extract(null)).isEmpty();
    }

    @Test
    void ignoresUnrelatedText() {
        assertThat(dict.extract("Nous recherchons une personne motivée et curieuse."))
                .doesNotContain("java", "react");
    }
}
