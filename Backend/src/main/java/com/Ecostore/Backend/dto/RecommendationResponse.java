package com.Ecostore.Backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RecommendationResponse {
    
    @JsonProperty("recommendations")
    private List<List<String>> recommendations;
    
    public RecommendationResponse() {}
    
    public RecommendationResponse(List<List<String>> recommendations) {
        this.recommendations = recommendations;
    }
    
    public List<List<String>> getRecommendations() {
        return recommendations;
    }
    
    public void setRecommendations(List<List<String>> recommendations) {
        this.recommendations = recommendations;
    }
}
