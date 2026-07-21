package com.bilalsaaoud.jobpilot.service.ai;

import com.bilalsaaoud.jobpilot.config.CandidateProfile;
import java.util.List;

/** Toutes les infos dont un moteur a besoin pour generer le mot de motivation et les conseils CV. */
public class GenerationContext {
    public final CandidateProfile profile;
    public final String company;
    public final String role;
    public final int matchScore;
    public final List<String> matched;
    public final List<String> missing;
    public final String offerText;

    public GenerationContext(CandidateProfile profile, String company, String role,
                             int matchScore, List<String> matched, List<String> missing, String offerText) {
        this.profile = profile;
        this.company = company;
        this.role = role;
        this.matchScore = matchScore;
        this.matched = matched;
        this.missing = missing;
        this.offerText = offerText;
    }
}
