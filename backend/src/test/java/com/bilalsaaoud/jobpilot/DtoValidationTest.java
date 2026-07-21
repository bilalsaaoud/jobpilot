package com.bilalsaaoud.jobpilot;

import com.bilalsaaoud.jobpilot.dto.AnalyzeRequest;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DtoValidationTest {

    private final Validator validator;
    { ValidatorFactory f = Validation.buildDefaultValidatorFactory(); validator = f.getValidator(); }

    @Test
    void blankOfferIsRejected() {
        AnalyzeRequest r = new AnalyzeRequest();
        r.setOfferText("   ");
        assertThat(validator.validate(r)).isNotEmpty();
    }

    @Test
    void oversizedOfferIsRejected() {
        AnalyzeRequest r = new AnalyzeRequest();
        r.setOfferText("x".repeat(20001));
        assertThat(validator.validate(r)).anyMatch(v -> v.getMessage().contains("trop longue"));
    }

    @Test
    void validRequestPasses() {
        AnalyzeRequest r = new AnalyzeRequest();
        r.setOfferText("Développeur Java Spring Boot, Docker, PostgreSQL.");
        r.setCompany("JCDecaux");
        assertThat(validator.validate(r)).isEmpty();
    }
}
