package com.bilalsaaoud.jobpilot.dto;

import com.bilalsaaoud.jobpilot.model.ApplicationStatus;
import java.time.LocalDate;

public class StatusUpdateRequest {
    private ApplicationStatus status;
    private LocalDate followUpDate;
    private String notes;

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
