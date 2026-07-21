package com.bilalsaaoud.jobpilot.dto;

import java.util.List;
import java.util.Map;

/** Resultat d'analyse renvoye au front. */
public class AnalysisResult {
    private Long id;                 // non-null si sauvegarde
    private int matchScore;
    private String verdict;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private String coverLetter;
    private String cvSuggestions;
    private String engine;

    // Detection automatique depuis le texte de l'offre
    private String detectedCompany;
    private String detectedRole;
    private String detectedLocation;
    private String detectedContract;

    // Idees de mini-projets pour combler les competences manquantes
    private List<Map<String, String>> projectIdeas;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }
    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }
    public List<String> getMatchedKeywords() { return matchedKeywords; }
    public void setMatchedKeywords(List<String> v) { this.matchedKeywords = v; }
    public List<String> getMissingKeywords() { return missingKeywords; }
    public void setMissingKeywords(List<String> v) { this.missingKeywords = v; }
    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
    public String getCvSuggestions() { return cvSuggestions; }
    public void setCvSuggestions(String cvSuggestions) { this.cvSuggestions = cvSuggestions; }
    public String getEngine() { return engine; }
    public void setEngine(String engine) { this.engine = engine; }
    public String getDetectedCompany() { return detectedCompany; }
    public void setDetectedCompany(String v) { this.detectedCompany = v; }
    public String getDetectedRole() { return detectedRole; }
    public void setDetectedRole(String v) { this.detectedRole = v; }
    public String getDetectedLocation() { return detectedLocation; }
    public void setDetectedLocation(String v) { this.detectedLocation = v; }
    public String getDetectedContract() { return detectedContract; }
    public void setDetectedContract(String v) { this.detectedContract = v; }
    public List<Map<String, String>> getProjectIdeas() { return projectIdeas; }
    public void setProjectIdeas(List<Map<String, String>> v) { this.projectIdeas = v; }
}
