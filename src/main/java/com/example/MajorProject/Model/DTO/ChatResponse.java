
package com.example.MajorProject.Model.DTO;

import com.example.MajorProject.Model.ChatbotKnowledge;
import com.example.MajorProject.Model.FoodPlace;
import com.example.MajorProject.Model.FoodTourItinerary;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ChatResponse {

    // Nội dung chatbot trả lời
    private String reply;

    // Khu vực được nhận diện
    private String detectedDistrict;

    // Loại món ăn được nhận diện
    private String detectedCuisineType;

    // Ngân sách được nhận diện
    private Integer detectedBudget;

    // Danh sách địa điểm phù hợp
    private List<FoodPlace> foodPlaces;

    // Kiến thức tìm được trong database
    private List<ChatbotKnowledge> knowledge;

    // Lịch trình Food Tour
    private FoodTourItinerary itinerary;


    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getDetectedDistrict() {
        return detectedDistrict;
    }

    public void setDetectedDistrict(String detectedDistrict) {
        this.detectedDistrict = detectedDistrict;
    }

    public String getDetectedCuisineType() {
        return detectedCuisineType;
    }

    public void setDetectedCuisineType(String detectedCuisineType) {
        this.detectedCuisineType = detectedCuisineType;
    }

    public Integer getDetectedBudget() {
        return detectedBudget;
    }

    public void setDetectedBudget(Integer detectedBudget) {
        this.detectedBudget = detectedBudget;
    }

    public List<FoodPlace> getFoodPlaces() {
        return foodPlaces;
    }

    public void setFoodPlaces(List<FoodPlace> foodPlaces) {
        this.foodPlaces = foodPlaces;
    }

    public List<ChatbotKnowledge> getKnowledge() {
        return knowledge;
    }

    public void setKnowledge(List<ChatbotKnowledge> knowledge) {
        this.knowledge = knowledge;
    }

    public FoodTourItinerary getItinerary() {
        return itinerary;
    }

    public void setItinerary(FoodTourItinerary itinerary) {
        this.itinerary = itinerary;
    }
}
