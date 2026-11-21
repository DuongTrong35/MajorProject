package com.example.MajorProject.Model;
import com.example.MajorProject.Model.FoodPlace;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class FoodTourStop {

    // Thứ tự địa điểm trong lịch trình
    private Integer sequence;

    // Hoạt động: Ăn sáng, ăn trưa, ăn vặt...
    private String activity;

    // Thời gian dự kiến
    private String visitTime;

    // Thời lượng tham quan (phút)
    private Integer durationMinutes;

    // Chi phí dự kiến tại địa điểm
    private Integer estimatedCost;

    // Khoảng cách từ địa điểm trước đó (km)
    private Double distanceFromPrevious;

    // Địa điểm ăn uống lấy từ MySQL
    private FoodPlace foodPlace;


    public Integer getSequence() {
        return sequence;
    }

    public void setSequence(Integer sequence) {
        this.sequence = sequence;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public String getVisitTime() {
        return visitTime;
    }

    public void setVisitTime(String visitTime) {
        this.visitTime = visitTime;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(Integer estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public Double getDistanceFromPrevious() {
        return distanceFromPrevious;
    }

    public void setDistanceFromPrevious(Double distanceFromPrevious) {
        this.distanceFromPrevious = distanceFromPrevious;
    }

    public FoodPlace getFoodPlace() {
        return foodPlace;
    }

    public void setFoodPlace(FoodPlace foodPlace) {
        this.foodPlace = foodPlace;
    }
}
