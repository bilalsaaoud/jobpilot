package com.bilalsaaoud.jobpilot.service;

import com.bilalsaaoud.jobpilot.dto.*;
import com.bilalsaaoud.jobpilot.model.ApplicationStatus;
import com.bilalsaaoud.jobpilot.model.JobApplication;
import com.bilalsaaoud.jobpilot.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

/** Gestion et suivi des candidatures. */
@Service
public class JobApplicationService {

    private final JobApplicationRepository repo;
    private final AnalysisService analysisService;

    public JobApplicationService(JobApplicationRepository repo, AnalysisService analysisService) {
        this.repo = repo;
        this.analysisService = analysisService;
    }

    /** Analyse une offre et, si demande, l'enregistre comme candidature. */
    public AnalysisResult analyzeAndMaybeSave(AnalyzeRequest req) {
        AnalysisResult result = analysisService.analyze(req);
        if (req.isSave()) {
            JobApplication app = new JobApplication();
            app.setCompany(req.getCompany());
            app.setRole(req.getRole());
            app.setLocation(req.getLocation());
            app.setContractType(req.getContractType());
            app.setSourceUrl(req.getSourceUrl());
            app.setOfferText(req.getOfferText());
            app.setMatchScore(result.getMatchScore());
            app.setMatchedKeywords(result.getMatchedKeywords());
            app.setMissingKeywords(result.getMissingKeywords());
            app.setCoverLetter(result.getCoverLetter());
            app.setCvSuggestions(result.getCvSuggestions());
            app.setStatus(ApplicationStatus.A_ENVOYER);
            JobApplication saved = repo.save(app);
            result.setId(saved.getId());
        }
        return result;
    }

    public List<JobApplication> findAll() { return repo.findAllByOrderByMatchScoreDesc(); }

    public JobApplication findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Candidature introuvable : " + id));
    }

    public JobApplication updateStatus(Long id, StatusUpdateRequest req) {
        JobApplication app = findById(id);
        if (req.getStatus() != null) app.setStatus(req.getStatus());
        if (req.getFollowUpDate() != null) app.setFollowUpDate(req.getFollowUpDate());
        if (req.getNotes() != null) app.setNotes(req.getNotes());
        return repo.save(app);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NoSuchElementException("Candidature introuvable : " + id);
        repo.deleteById(id);
    }

    /** Candidatures a relancer : date de relance atteinte et pas encore en entretien/offre. */
    public List<JobApplication> dueForFollowUp() {
        return repo.findByFollowUpDateLessThanEqualAndStatusIn(
                LocalDate.now(),
                List.of(ApplicationStatus.ENVOYEE, ApplicationStatus.RELANCEE));
    }

    public StatsResponse stats() {
        List<JobApplication> all = repo.findAll();
        StatsResponse s = new StatsResponse();
        s.setTotal(all.size());
        s.setAverageScore(all.stream().filter(a -> a.getMatchScore() != null)
                .mapToInt(JobApplication::getMatchScore).average().orElse(0));
        s.setInterviews(all.stream().filter(a -> a.getStatus() == ApplicationStatus.ENTRETIEN).count());
        s.setOffers(all.stream().filter(a -> a.getStatus() == ApplicationStatus.OFFRE).count());
        Map<String, Long> byStatus = all.stream().collect(Collectors.groupingBy(
                a -> a.getStatus().name(), Collectors.counting()));
        s.setByStatus(byStatus);
        return s;
    }
}
