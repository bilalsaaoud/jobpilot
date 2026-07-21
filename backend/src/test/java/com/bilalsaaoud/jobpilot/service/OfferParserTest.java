package com.bilalsaaoud.jobpilot.service;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class OfferParserTest {
    private final OfferParser parser = new OfferParser();

    @Test
    void detectsKnownCompanyAndCity() {
        var d = parser.parse("Rejoignez Capgemini à Lyon en alternance.");
        assertThat(d.company).isEqualTo("Capgemini");
        assertThat(d.location).isEqualTo("Lyon");
        assertThat(d.contractType).isEqualTo("Alternance");
    }

    @Test
    void detectsRoleTitle() {
        var d = parser.parse("Nous recherchons un Développeur Full-stack H/F pour notre équipe.");
        assertThat(d.role).containsIgnoringCase("Développeur");
    }

    @Test
    void handlesEmpty() {
        var d = parser.parse("");
        assertThat(d.company).isNull();
        assertThat(d.role).isNull();
    }
}
