package com.bilalsaaoud.jobpilot.dto;

import com.bilalsaaoud.jobpilot.model.ApplicationStatus;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class StatusUpdateRequest {
    private ApplicationStatus status;
    private LocalDate followUpDate;
    @Size(max = 3000) private String notes;

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
