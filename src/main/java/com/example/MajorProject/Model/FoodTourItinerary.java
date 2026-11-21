package com.example.MajorProject.Model;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class FoodTourItinerary {

    // Tên lịch trình
    private String title;

    // Ngân sách người dùng
    private Integer budget;

    // Tổng chi phí dự kiến
    private Integer totalEstimatedCost;

    // Số tiền còn lại
    private Integer remainingBudget;

    // Thời gian bắt đầu
    private String startTime;

    // Thời gian kết thúc
    private String endTime;

    // Số lượng địa điểm
    private Integer totalStops;

    // Danh sách các điểm dừng
    private List<FoodTourStop> stops;


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getBudget() {
        return budget;
    }

    public void setBudget(Integer budget) {
        this.budget = budget;
    }

    public Integer getTotalEstimatedCost() {
        return totalEstimatedCost;
    }

    public void setTotalEstimatedCost(Integer totalEstimatedCost) {
        this.totalEstimatedCost = totalEstimatedCost;
    }

    public Integer getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(Integer remainingBudget) {
        this.remainingBudget = remainingBudget;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public Integer getTotalStops() {
        return totalStops;
    }

    public void setTotalStops(Integer totalStops) {
        this.totalStops = totalStops;
    }

    public List<FoodTourStop> getStops() {
        return stops;
    }

    public void setStops(List<FoodTourStop> stops) {
        this.stops = stops;
    }
}
