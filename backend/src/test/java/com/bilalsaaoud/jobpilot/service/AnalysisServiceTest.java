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
        CandidateProfile profile = new CandidateProfile();
        KeywordAiClient keyword = new KeywordAiClient();
        OpenAiAiClient openai = new OpenAiAiClient("", "gpt-4o-mini",
                "https://api.openai.com/v1", keyword);
        DomainRegistry domains = new DomainRegistry(new TechDictionary());
        return new AnalysisService(profile, openai, keyword,
                new OfferParser(), new ProjectIdeas(), domains);
    }

    @Test
    void strongOfferGivesHighScoreAndCoverLetter() {
        AnalyzeRequest req = new AnalyzeRequest();
        req.setCompany("Sopra Steria");
        req.setRole("Developpeur Java");
        req.setOfferText("Java, Spring Boot, PostgreSQL, REST, JUnit, Docker, CI/CD, Agile Scrum.");
        AnalysisResult r = newService().analyze(req);

        assertThat(r.getMatchScore()).isGreaterThanOrEqualTo(80);
        assertThat(r.getMatchedKeywords()).contains("java", "spring boot", "docker");
        assertThat(r.getCoverLetter()).contains("Sopra Steria");
        assertThat(r.getEngine()).isEqualTo("keyword");
    }

    @Test
    void missingSkillsProduceProjectIdeas() {
        AnalyzeRequest req = new AnalyzeRequest();
        req.setOfferText("Angular, Kafka, Kubernetes, AWS, GraphQL.");
        AnalysisResult r = newService().analyze(req);

        assertThat(r.getMissingKeywords()).contains("angular", "kafka");
        assertThat(r.getProjectIdeas()).isNotEmpty();
        assertThat(r.getProjectIdeas().get(0)).containsKeys("skill", "idea");
    }

    @Test
    void autoDetectsCompanyRoleLocationContract() {
        AnalyzeRequest req = new AnalyzeRequest();
        req.setOfferText("Alternance Développeur Java/Angular chez JCDecaux à Neuilly-sur-Seine. "
                + "Java 17, Spring Boot, Angular.");
        AnalysisResult r = newService().analyze(req);

        assertThat(r.getDetectedCompany()).isEqualTo("JCDecaux");
        assertThat(r.getDetectedContract()).isEqualTo("Alternance");
        assertThat(r.getDetectedLocation()).isEqualTo("Neuilly-sur-Seine");
        assertThat(r.getDetectedRole()).containsIgnoringCase("Développeur");
    }

    @Test
    void emptyOfferGivesNeutralScore() {
        AnalyzeRequest req = new AnalyzeRequest();
        req.setOfferText("Personne motivée, curieuse, autonome.");
        AnalysisResult r = newService().analyze(req);
        assertThat(r.getMatchScore()).isEqualTo(50);
    }
}
