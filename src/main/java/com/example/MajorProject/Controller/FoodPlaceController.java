package com.example.MajorProject.Controller;


import com.example.MajorProject.Model.FoodPlace;
import com.example.MajorProject.Service.FoodPlaceService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/food-places")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodPlaceController {

    private final FoodPlaceService foodPlaceService;

    public FoodPlaceController(FoodPlaceService foodPlaceService) {
        this.foodPlaceService = foodPlaceService;
    }

    // 1. GET: Lấy danh sách địa điểm
    // GET /api/food-places
    @GetMapping
    public ResponseEntity<List<FoodPlace>> getAllFoodPlaces() {

        return ResponseEntity.ok(
                foodPlaceService.getAllFoodPlaces()
        );
    }

    // 2. GET: Lấy địa điểm theo ID
    // GET /api/food-places/1
    @GetMapping("/{id}")
    public ResponseEntity<FoodPlace> getFoodPlaceById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                foodPlaceService.getFoodPlaceById(id)
        );
    }

    // 3. GET: Tìm kiếm địa điểm
    // GET /api/food-places/search?district=Quận 7&cuisineType=Đồ nướng
    @GetMapping("/search")
    public ResponseEntity<List<FoodPlace>> searchFoodPlaces(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String cuisineType
    ) {

        return ResponseEntity.ok(
                foodPlaceService.searchFoodPlaces(
                        district,
                        cuisineType
                )
        );
    }

    // 4. POST: Thêm địa điểm mới
    // POST /api/food-places
    @PostMapping
    public ResponseEntity<FoodPlace> createFoodPlace(
            @RequestBody FoodPlace foodPlace
    ) {

        FoodPlace result =
                foodPlaceService.createFoodPlace(foodPlace);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(result);
    }

    // 5. PUT: Cập nhật địa điểm
    // PUT /api/food-places/1
    @PutMapping("/{id}")
    public ResponseEntity<FoodPlace> updateFoodPlace(
            @PathVariable Long id,
            @RequestBody FoodPlace foodPlace
    ) {

        return ResponseEntity.ok(
                foodPlaceService.updateFoodPlace(id, foodPlace)
        );
    }

    // 6. DELETE: Xóa địa điểm
    // DELETE /api/food-places/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodPlace(
            @PathVariable Long id
    ) {

        foodPlaceService.deleteFoodPlace(id);

        return ResponseEntity.noContent().build();
    }
}
