package com.bilalsaaoud.jobpilot.service.ai;

public class GenerationResult {
    public final String coverLetter;
    public final String cvSuggestions;
    public final String engine;
    public GenerationResult(String coverLetter, String cvSuggestions, String engine) {
        this.coverLetter = coverLetter;
        this.cvSuggestions = cvSuggestions;
        this.engine = engine;
    }
}
