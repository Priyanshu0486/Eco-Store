package com.Ecostore.Backend.dto;

import java.math.BigDecimal;

public class DashboardStatsDto {
    private BigDecimal totalSpent;
    private BigDecimal totalSaved;
    private Integer ecoCoinsEarned;
    private BigDecimal carbonSaved;
    private Integer totalOrders;

    // Default constructor
    public DashboardStatsDto() {}

    // Constructor with all fields
    public DashboardStatsDto(BigDecimal totalSpent, BigDecimal totalSaved, Integer ecoCoinsEarned, BigDecimal carbonSaved, Integer totalOrders) {
        this.totalSpent = totalSpent;
        this.totalSaved = totalSaved;
        this.ecoCoinsEarned = ecoCoinsEarned;
        this.carbonSaved = carbonSaved;
        this.totalOrders = totalOrders;
    }

    // Getters and Setters
    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
    }

    public BigDecimal getTotalSaved() {
        return totalSaved;
    }

    public void setTotalSaved(BigDecimal totalSaved) {
        this.totalSaved = totalSaved;
    }

    public Integer getEcoCoinsEarned() {
        return ecoCoinsEarned;
    }

    public void setEcoCoinsEarned(Integer ecoCoinsEarned) {
        this.ecoCoinsEarned = ecoCoinsEarned;
    }

    public BigDecimal getCarbonSaved() {
        return carbonSaved;
    }

    public void setCarbonSaved(BigDecimal carbonSaved) {
        this.carbonSaved = carbonSaved;
    }

    public Integer getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Integer totalOrders) {
        this.totalOrders = totalOrders;
    }
}
