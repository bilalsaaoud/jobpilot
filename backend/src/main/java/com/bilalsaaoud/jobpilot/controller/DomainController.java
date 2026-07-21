package com.bilalsaaoud.jobpilot.controller;

import com.bilalsaaoud.jobpilot.service.DomainRegistry;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api/domains")
@Tag(name = "Domaines", description = "Domaines métiers supportés")
public class DomainController {

    private final DomainRegistry registry;
    public DomainController(DomainRegistry registry) { this.registry = registry; }

    @GetMapping
    @Operation(summary = "Liste des domaines (compétences, postes, profil par défaut)")
    public Collection<DomainRegistry.Domain> all() { return registry.all(); }
}
