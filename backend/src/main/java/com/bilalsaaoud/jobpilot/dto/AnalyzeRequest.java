package com.bilalsaaoud.jobpilot.dto;

import jakarta.validation.constraints.NotBlank;

/** Requete d'analyse : au minimum le texte de l'offre. */
public class AnalyzeRequest {
    @NotBlank(message = "Le texte de l'offre est obligatoire")
    private String offerText;
    private String company;
    private String role;
    private String location;
    private String contractType;
    private String sourceUrl;
    /** Si true, la candidature est aussi enregistree en base. */
    private boolean save = false;

    public String getOfferText() { return offerText; }
    public void setOfferText(String offerText) { this.offerText = offerText; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getContractType() { return contractType; }
    public void setContractType(String contractType) { this.contractType = contractType; }
    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }
    public boolean isSave() { return save; }
    public void setSave(boolean save) { this.save = save; }
}
