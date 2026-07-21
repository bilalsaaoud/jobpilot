package com.bilalsaaoud.jobpilot.repository;

import com.bilalsaaoud.jobpilot.model.ApplicationStatus;
import com.bilalsaaoud.jobpilot.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findAllByOrderByMatchScoreDesc();
    List<JobApplication> findByStatus(ApplicationStatus status);
    List<JobApplication> findByFollowUpDateLessThanEqualAndStatusIn(LocalDate date, List<ApplicationStatus> statuses);
}
