package com.bilalsaaoud.jobpilot.dto;

import java.util.Map;

public class StatsResponse {
    private long total;
    private double averageScore;
    private long interviews;
    private long offers;
    private Map<String, Long> byStatus;

    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }
    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
    public long getInterviews() { return interviews; }
    public void setInterviews(long interviews) { this.interviews = interviews; }
    public long getOffers() { return offers; }
    public void setOffers(long offers) { this.offers = offers; }
    public Map<String, Long> getByStatus() { return byStatus; }
    public void setByStatus(Map<String, Long> byStatus) { this.byStatus = byStatus; }
}
