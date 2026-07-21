package com.bilalsaaoud.jobpilot.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** Une candidature : l'offre, son analyse IA et son suivi. */
@Entity
@Table(name = "job_application")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;
    private String role;
    private String location;
    private String contractType;
    private String sourceUrl;

    @Column(columnDefinition = "text")
    private String offerText;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.A_ENVOYER;

    /** Score de compatibilite 0-100 calcule a l'analyse. */
    private Integer matchScore;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "app_matched_kw", joinColumns = @JoinColumn(name = "app_id"))
    @Column(name = "keyword")
    private List<String> matchedKeywords = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "app_missing_kw", joinColumns = @JoinColumn(name = "app_id"))
    @Column(name = "keyword")
    private List<String> missingKeywords = new ArrayList<>();

    @Column(columnDefinition = "text")
    private String coverLetter;

    @Column(columnDefinition = "text")
    private String cvSuggestions;

    private LocalDate followUpDate;

    @Column(columnDefinition = "text")
    private String notes;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void onUpdate() { this.updatedAt = Instant.now(); }

    // getters / setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public String getOfferText() { return offerText; }
    public void setOfferText(String offerText) { this.offerText = offerText; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public Integer getMatchScore() { return matchScore; }
    public void setMatchScore(Integer matchScore) { this.matchScore = matchScore; }
    public List<String> getMatchedKeywords() { return matchedKeywords; }
    public void setMatchedKeywords(List<String> v) { this.matchedKeywords = v; }
    public List<String> getMissingKeywords() { return missingKeywords; }
    public void setMissingKeywords(List<String> v) { this.missingKeywords = v; }
    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
    public String getCvSuggestions() { return cvSuggestions; }
    public void setCvSuggestions(String cvSuggestions) { this.cvSuggestions = cvSuggestions; }
    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
