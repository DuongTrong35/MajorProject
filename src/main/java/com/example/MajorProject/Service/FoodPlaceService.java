package com.example.MajorProject.Service;

import com.example.MajorProject.Model.FoodPlace;
import com.example.MajorProject.Repository.FoodPlaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class FoodPlaceService {

    private final FoodPlaceRepository foodPlaceRepository;

    public FoodPlaceService(FoodPlaceRepository foodPlaceRepository) {
        this.foodPlaceRepository = foodPlaceRepository;
    }

    // 1. Lấy tất cả địa điểm đang hoạt động
    public List<FoodPlace> getAllFoodPlaces() {
        return foodPlaceRepository.findByIsActiveTrue();
    }

    // 2. Lấy địa điểm theo ID
    public FoodPlace getFoodPlaceById(Long id) {
        return foodPlaceRepository.findById(id)
                .filter(place -> Boolean.TRUE.equals(place.getActive()))                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy địa điểm ăn uống!"
                ));
    }

    // 3. Tìm kiếm địa điểm theo quận và loại món ăn
    public List<FoodPlace> searchFoodPlaces(
            String district,
            String cuisineType
    ) {

        if (district != null && !district.isBlank()
                && cuisineType != null && !cuisineType.isBlank()) {

            return foodPlaceRepository
                    .findByDistrictContainingIgnoreCaseAndCuisineTypeContainingIgnoreCaseAndIsActiveTrue(
                            district, cuisineType
                    );
        }

        if (district != null && !district.isBlank()) {
            return foodPlaceRepository
                    .findByDistrictContainingIgnoreCaseAndIsActiveTrue(district);
        }

        if (cuisineType != null && !cuisineType.isBlank()) {
            return foodPlaceRepository
                    .findByCuisineTypeContainingIgnoreCaseAndIsActiveTrue(cuisineType);
        }

        return getAllFoodPlaces();
    }

    // 4. Thêm địa điểm mới
    @Transactional
    public FoodPlace createFoodPlace(FoodPlace foodPlace) {

        foodPlace.setId(null);
        foodPlace.setActive(true);
        return foodPlaceRepository.save(foodPlace);
    }

    // 5. Cập nhật địa điểm
    @Transactional
    public FoodPlace updateFoodPlace(Long id, FoodPlace newData) {

        FoodPlace oldData = getFoodPlaceById(id);

        oldData.setName(newData.getName());
        oldData.setAddress(newData.getAddress());
        oldData.setDistrict(newData.getDistrict());
        oldData.setCuisineType(newData.getCuisineType());
        oldData.setPriceMin(newData.getPriceMin());
        oldData.setPriceMax(newData.getPriceMax());
        oldData.setDescription(newData.getDescription());
        oldData.setOpeningHours(newData.getOpeningHours());
        oldData.setLatitude(newData.getLatitude());
        oldData.setLongitude(newData.getLongitude());
        oldData.setGoogleMapsUrl(newData.getGoogleMapsUrl());

        if (newData.getActive() != null) {
            oldData.setActive(newData.getActive());
        }

        return foodPlaceRepository.save(oldData);
    }

    // 6. Xóa địa điểm (xóa mềm)
    @Transactional
    public void deleteFoodPlace(Long id) {

        FoodPlace foodPlace = getFoodPlaceById(id);

        foodPlace.setActive(false);
        foodPlaceRepository.save(foodPlace);
    }
}
