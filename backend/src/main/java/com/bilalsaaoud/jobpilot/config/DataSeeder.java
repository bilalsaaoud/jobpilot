package com.bilalsaaoud.jobpilot.config;

import com.bilalsaaoud.jobpilot.dto.AnalyzeRequest;
import com.bilalsaaoud.jobpilot.model.ApplicationStatus;
import com.bilalsaaoud.jobpilot.model.JobApplication;
import com.bilalsaaoud.jobpilot.repository.JobApplicationRepository;
import com.bilalsaaoud.jobpilot.service.AnalysisService;
import com.bilalsaaoud.jobpilot.dto.AnalysisResult;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/** Cree quelques candidatures de demonstration au premier demarrage (base vide). */
@Component
public class DataSeeder implements CommandLineRunner {

    private final JobApplicationRepository repo;
    private final AnalysisService analysis;

    public DataSeeder(JobApplicationRepository repo, AnalysisService analysis) {
        this.repo = repo;
        this.analysis = analysis;
    }

    @Override
    public void run(String... args) {
        if (repo.count() > 0) return;

        seed("JCDecaux", "Alternance Developpeur Java/Angular", "Neuilly-sur-Seine", "Alternance",
                "Au sein de la DSI, vous developpez des applications en Java 17 et 21, Spring Boot 3, "
                        + "JPA Hibernate, PostgreSQL, Kafka, API REST, tests JUnit et Cucumber. "
                        + "CI/CD avec Maven, Jenkins, Sonar, Docker, Kubernetes, AWS. "
                        + "Front-end Angular 19. Methodes Agile, Jira, Confluence.",
                ApplicationStatus.ENVOYEE, LocalDate.now().plusDays(5));

        seed("Sopra Steria", "Alternance Developpeur Java", "Lyon", "Alternance",
                "Developpement d'applications Java Spring Boot et ASP.NET Core. Tests unitaires JUnit, "
                        + "qualite logicielle. DevOps Docker, GitLab CI. Bases PostgreSQL. Agile Scrum. Anglais B2.",
                ApplicationStatus.ENTRETIEN, null);

        seed("Doctolib", "Alternance Developpeur Full-stack", "Levallois", "Alternance",
                "Stack React, TypeScript, Node.js, Ruby on Rails, PostgreSQL, Docker, CI/CD. Equipe Agile.",
                ApplicationStatus.A_ENVOYER, null);
    }

    private void seed(String company, String role, String loc, String contract,
                      String offer, ApplicationStatus status, LocalDate followUp) {
        AnalyzeRequest req = new AnalyzeRequest();
        req.setCompany(company); req.setRole(role); req.setLocation(loc);
        req.setContractType(contract); req.setOfferText(offer);
        AnalysisResult r = analysis.analyze(req);

        JobApplication app = new JobApplication();
        app.setCompany(company); app.setRole(role); app.setLocation(loc);
        app.setContractType(contract); app.setOfferText(offer);
        app.setMatchScore(r.getMatchScore());
        app.setMatchedKeywords(r.getMatchedKeywords());
        app.setMissingKeywords(r.getMissingKeywords());
        app.setCoverLetter(r.getCoverLetter());
        app.setCvSuggestions(r.getCvSuggestions());
        app.setStatus(status);
        app.setFollowUpDate(followUp);
        repo.save(app);
    }
}
