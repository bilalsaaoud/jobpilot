package com.bilalsaaoud.jobpilot.controller;

import com.bilalsaaoud.jobpilot.config.CandidateProfile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@Tag(name = "Profil", description = "Profil du candidat")
public class ProfileController {

    private final CandidateProfile profile;
    public ProfileController(CandidateProfile profile) { this.profile = profile; }

    @GetMapping
    @Operation(summary = "Profil du candidat utilise pour l'analyse")
    public CandidateProfile profile() { return profile; }
}
