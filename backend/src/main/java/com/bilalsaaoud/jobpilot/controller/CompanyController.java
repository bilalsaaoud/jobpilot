package com.bilalsaaoud.jobpilot.controller;

import com.bilalsaaoud.jobpilot.service.CompanyDirectory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@Tag(name = "Entreprises", description = "Autocomplétion des entreprises")
public class CompanyController {

    private final CompanyDirectory directory;
    public CompanyController(CompanyDirectory directory) { this.directory = directory; }

    @GetMapping
    @Operation(summary = "Suggestions d'entreprises à partir d'une saisie",
            description = "Ex: /api/companies?q=cap renvoie Capgemini…")
    public List<CompanyDirectory.Company> search(@RequestParam(name = "q", defaultValue = "") String q) {
        return directory.search(q, 8);
    }
}
