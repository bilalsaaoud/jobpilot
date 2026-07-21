package com.bilalsaaoud.jobpilot.service;

import com.bilalsaaoud.jobpilot.config.CandidateProfile;
import com.bilalsaaoud.jobpilot.dto.AnalysisResult;
import com.bilalsaaoud.jobpilot.dto.AnalyzeRequest;
import com.bilalsaaoud.jobpilot.service.ai.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/** Coeur du produit : compare une offre au profil et produit un resultat exploitable. */
@Service
public class AnalysisService {

    private final CandidateProfile profile;
    private final OpenAiAiClient openAi;
    private final KeywordAiClient keyword;
    private final OfferParser parser;
    private final ProjectIdeas projectIdeas;
    private final DomainRegistry domains;

    public AnalysisService(CandidateProfile profile, OpenAiAiClient openAi, KeywordAiClient keyword,
                           OfferParser parser, ProjectIdeas projectIdeas, DomainRegistry domains) {
        this.profile = profile;
        this.openAi = openAi;
        this.keyword = keyword;
        this.parser = parser;
        this.projectIdeas = projectIdeas;
        this.domains = domains;
    }

    public AnalysisResult analyze(AnalyzeRequest req) {
        String domain = (req.getDomain() == null || req.getDomain().isBlank()) ? "informatique" : req.getDomain();

        // 1) detection automatique
        OfferParser.Detected det = parser.parse(req.getOfferText());
        if (isBlank(req.getCompany())) req.setCompany(det.company);
        if (isBlank(req.getRole())) req.setRole(det.role);
        if (isBlank(req.getLocation())) req.setLocation(det.location);
        if (isBlank(req.getContractType())) req.setContractType(det.contractType);

        // 2) competences de l'offre pour le domaine choisi
        Set<String> offerSkills = domains.extract(domain, req.getOfferText());

        // 3) competences de l'utilisateur : celles fournies, sinon le profil par defaut du domaine
        Set<String> mine = new LinkedHashSet<>();
        if (req.getUserSkills() != null && !req.getUserSkills().isEmpty()) {
            for (String s : req.getUserSkills()) if (s != null && !s.isBlank()) mine.add(s.toLowerCase());
        } else if ("informatique".equals(domain)) {
            mine.addAll(profile.skillSet());
        } else {
            mine.addAll(domains.defaultProfileSkills(domain));
        }
        Set<String> learning = "informatique".equals(domain) ? profile.learningSet() : Set.of();

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        double weighted = 0;
        for (String s : offerSkills) {
            if (mine.contains(s)) { matched.add(s); weighted += 1.0; }
            else if (learning.contains(s)) { missing.add(s); weighted += 0.4; }
            else { missing.add(s); }
        }
        int score = offerSkills.isEmpty() ? 50 : (int) Math.round(100.0 * weighted / offerSkills.size());
        score = Math.max(0, Math.min(100, score));

        // 4) generation
        AiClient engine = openAi.isEnabled() ? openAi : keyword;
        GenerationContext ctx = new GenerationContext(
                profile, req.getCompany(), req.getRole(), score, matched, missing, req.getOfferText());
        GenerationResult gen = engine.generate(ctx);

        AnalysisResult r = new AnalysisResult();
        r.setMatchScore(score);
        r.setVerdict(verdict(score));
        r.setMatchedKeywords(matched);
        r.setMissingKeywords(missing);
        r.setCoverLetter(gen.coverLetter);
        r.setCvSuggestions(gen.cvSuggestions);
        r.setEngine(gen.engine);
        r.setDetectedCompany(det.company);
        r.setDetectedRole(det.role);
        r.setDetectedLocation(det.location);
        r.setDetectedContract(det.contractType);
        r.setProjectIdeas(projectIdeas.forMissing(missing, 4));
        return r;
    }

    private boolean isBlank(String s) { return s == null || s.isBlank(); }

    private String verdict(int score) {
        if (score >= 80) return "Excellent match — postule en priorité";
        if (score >= 60) return "Bon match — candidature pertinente";
        if (score >= 40) return "Match partiel — mets en avant tes atouts transférables";
        return "Match faible — à tenter seulement si l'offre te motive vraiment";
    }
}
