package com.example.MajorProject.Repository;


import com.example.MajorProject.Model.FoodPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodPlaceRepository
        extends JpaRepository<FoodPlace, Long> {

    // Tìm địa điểm theo quận
    List<FoodPlace> findByDistrictContainingIgnoreCaseAndIsActiveTrue(
            String district
    );

    // Tìm địa điểm theo loại món ăn
    List<FoodPlace> findByCuisineTypeContainingIgnoreCaseAndIsActiveTrue(
            String cuisineType
    );

    // Tìm địa điểm theo quận và loại món ăn
    List<FoodPlace> findByDistrictContainingIgnoreCaseAndCuisineTypeContainingIgnoreCaseAndIsActiveTrue(
            String district,
            String cuisineType
    );

    // Lấy tất cả địa điểm đang hoạt động
    List<FoodPlace> findByIsActiveTrue();
}
