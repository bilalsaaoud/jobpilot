package com.bilalsaaoud.jobpilot.service;

import org.junit.jupiter.api.Test;
import java.util.Set;
import static org.assertj.core.api.Assertions.assertThat;

class DomainRegistryTest {
    private final DomainRegistry reg = new DomainRegistry(new TechDictionary());

    @Test
    void loadsAllDomains() {
        assertThat(reg.all()).hasSizeGreaterThanOrEqualTo(8);
        assertThat(reg.get("marketing").label).contains("Marketing");
    }

    @Test
    void extractsMarketingSkills() {
        Set<String> s = reg.extract("marketing",
            "Vous gérez le SEO, le community management et les réseaux sociaux avec Google Analytics.");
        assertThat(s).contains("seo", "community management", "réseaux sociaux", "google analytics");
    }

    @Test
    void unknownDomainFallsBackToInformatique() {
        assertThat(reg.get("xxx").id).isEqualTo("informatique");
    }
}
