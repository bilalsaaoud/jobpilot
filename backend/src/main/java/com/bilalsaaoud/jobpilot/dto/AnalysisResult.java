package com.bilalsaaoud.jobpilot.dto;

import java.util.List;

/** Resultat d'analyse renvoye au front. */
public class AnalysisResult {
    private Long id;                 // non-null si sauvegarde
    private int matchScore;
    private String verdict;          // ex "Excellent match"
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private String coverLetter;
    private String cvSuggestions;
    private String engine;           // "openai" ou "keyword"

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
}
