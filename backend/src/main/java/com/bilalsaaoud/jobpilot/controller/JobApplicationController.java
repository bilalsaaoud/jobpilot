package com.bilalsaaoud.jobpilot.controller;

import com.bilalsaaoud.jobpilot.dto.StatsResponse;
import com.bilalsaaoud.jobpilot.dto.StatusUpdateRequest;
import com.bilalsaaoud.jobpilot.model.JobApplication;
import com.bilalsaaoud.jobpilot.service.JobApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Candidatures", description = "Suivi des candidatures")
public class JobApplicationController {

    private final JobApplicationService service;
    public JobApplicationController(JobApplicationService service) { this.service = service; }

    @GetMapping
    @Operation(summary = "Lister les candidatures (triees par score)")
    public List<JobApplication> all() { return service.findAll(); }

    @GetMapping("/{id}")
    @Operation(summary = "Detail d'une candidature")
    public JobApplication one(@PathVariable Long id) { return service.findById(id); }

    @PatchMapping("/{id}")
    @Operation(summary = "Mettre a jour le statut / la relance / les notes")
    public JobApplication update(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest req) {
        return service.updateStatus(id, req);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une candidature")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/follow-up")
    @Operation(summary = "Candidatures a relancer aujourd'hui")
    public List<JobApplication> followUp() { return service.dueForFollowUp(); }

    @GetMapping("/stats")
    @Operation(summary = "Statistiques globales du tableau de bord")
    public StatsResponse stats() { return service.stats(); }
}
