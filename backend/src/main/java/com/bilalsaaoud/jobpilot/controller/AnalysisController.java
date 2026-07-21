package com.bilalsaaoud.jobpilot.controller;

import com.bilalsaaoud.jobpilot.dto.AnalysisResult;
import com.bilalsaaoud.jobpilot.dto.AnalyzeRequest;
import com.bilalsaaoud.jobpilot.service.JobApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyze")
@Tag(name = "Analyse", description = "Analyse d'une offre et generation de contenu")
public class AnalysisController {

    private final JobApplicationService service;
    public AnalysisController(JobApplicationService service) { this.service = service; }

    @PostMapping
    @Operation(summary = "Analyser une offre",
            description = "Calcule le score de compatibilite, les mots-cles alignes/manquants, "
                    + "genere un mot de motivation et des conseils CV. Enregistre si save=true.")
    public AnalysisResult analyze(@Valid @RequestBody AnalyzeRequest request) {
        return service.analyzeAndMaybeSave(request);
    }
}
