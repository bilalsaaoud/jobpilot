package com.bilalsaaoud.jobpilot.service;

import com.bilalsaaoud.jobpilot.config.CandidateProfile;
import com.bilalsaaoud.jobpilot.dto.AnalysisResult;
import com.bilalsaaoud.jobpilot.dto.AnalyzeRequest;
import com.bilalsaaoud.jobpilot.service.ai.KeywordAiClient;
import com.bilalsaaoud.jobpilot.service.ai.OpenAiAiClient;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AnalysisServiceTest {

    private AnalysisService newService() {
        TechDictionary dict = new TechDictionary();
        CandidateProfile profile = new CandidateProfile();
        KeywordAiClient keyword = new KeywordAiClient();
        // Pas de cle API -> OpenAiAiClient delegue au moteur mots-cles
        OpenAiAiClient openai = new OpenAiAiClient("", "gpt-4o-mini",
                "https://api.openai.com/v1", keyword);
        return new AnalysisService(dict, profile, openai, keyword);
    }

    @Test
    void strongOfferGivesHighScoreAndCoverLetter() {
        AnalysisService s = newService();
        AnalyzeRequest req = new AnalyzeRequest();
        req.setCompany("Sopra Steria");
        req.setRole("Developpeur Java");
        req.setOfferText("Java, Spring Boot, PostgreSQL, REST, JUnit, Docker, CI/CD, Agile Scrum.");
        AnalysisResult r = s.analyze(req);

        assertThat(r.getMatchScore()).isGreaterThanOrEqualTo(80);
        assertThat(r.getMatchedKeywords()).contains("java", "spring boot", "docker");
        assertThat(r.getCoverLetter()).contains("Sopra Steria");
        assertThat(r.getEngine()).isEqualTo("keyword");
    }

    @Test
    void missingSkillsAppearInGaps() {
        AnalysisService s = newService();
        AnalyzeRequest req = new AnalyzeRequest();
        req.setOfferText("Angular, Kafka, Kubernetes, AWS, GraphQL.");
        AnalysisResult r = s.analyze(req);

        assertThat(r.getMissingKeywords()).contains("graphql");
        assertThat(r.getMatchScore()).isLessThan(80);
    }

    @Test
    void emptyOfferGivesNeutralScore() {
        AnalysisService s = newService();
        AnalyzeRequest req = new AnalyzeRequest();
        req.setOfferText("Personne motivée, curieuse, autonome.");
        AnalysisResult r = s.analyze(req);
        assertThat(r.getMatchScore()).isEqualTo(50);
    }
}
