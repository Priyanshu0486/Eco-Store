package com.Ecostore.Backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RecommendationRequest {
    
    @JsonProperty("prod_id")
    private String prodId;
    
    public RecommendationRequest() {}
    
    public RecommendationRequest(String prodId) {
        this.prodId = prodId;
    }
    
    public String getProdId() {
        return prodId;
    }
    
    public void setProdId(String prodId) {
        this.prodId = prodId;
    }
}
