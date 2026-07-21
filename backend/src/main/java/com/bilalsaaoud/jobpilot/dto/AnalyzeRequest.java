package com.bilalsaaoud.jobpilot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

/** Requete d'analyse : au minimum le texte de l'offre. */
public class AnalyzeRequest {
    @NotBlank(message = "Le texte de l'offre est obligatoire")
    @Size(max = 20000, message = "L'offre est trop longue (20000 caractères max)")
    private String offerText;
    @Size(max = 150) private String company;
    @Size(max = 150) private String role;
    @Size(max = 150) private String location;
    @Size(max = 60) private String contractType;
    @Size(max = 500) private String sourceUrl;
    /** Si true, la candidature est aussi enregistree en base. */
    private boolean save = false;
    @Size(max = 40) private String domain = "informatique";
    @Size(max = 60, message = "Trop de compétences (60 max)")
    private List<@Size(max = 60) String> userSkills;

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
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    public List<String> getUserSkills() { return userSkills; }
    public void setUserSkills(List<String> userSkills) { this.userSkills = userSkills; }
}
