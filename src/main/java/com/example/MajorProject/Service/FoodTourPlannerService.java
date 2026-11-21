package com.example.MajorProject.Service;
import com.example.MajorProject.Model.FoodPlace;
import com.example.MajorProject.Model.FoodTourItinerary;
import com.example.MajorProject.Model.FoodTourStop;
import com.example.MajorProject.Repository.FoodPlaceRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class FoodTourPlannerService {

    private final FoodPlaceRepository foodPlaceRepository;

    public FoodTourPlannerService(
            FoodPlaceRepository foodPlaceRepository
    ) {
        this.foodPlaceRepository = foodPlaceRepository;
    }

    // Một hoạt động trong Food Tour
    private static class TourActivity {

        private final String name;
        private final String[] keywords;
        private final String time;

        public TourActivity(
                String name,
                String[] keywords,
                String time
        ) {
            this.name = name;
            this.keywords = keywords;
            this.time = time;
        }
    }

    // =====================================
    // 1. LẬP LỊCH TRÌNH FOOD TOUR
    // =====================================

    public FoodTourItinerary createItinerary(
            Integer budget,
            String district,
            String normalizedMessage
    ) {

        // 1. Lấy danh sách địa điểm đang hoạt động
        List<FoodPlace> allPlaces =
                foodPlaceRepository.findByIsActiveTrue();

        // 2. Xác định những hoạt động cần có
        List<TourActivity> activities =
                detectActivities(normalizedMessage);

        // 3. Khởi tạo lịch trình
        FoodTourItinerary itinerary =
                new FoodTourItinerary();

        itinerary.setTitle("Food Tour Sài Gòn");

        itinerary.setBudget(budget);

        itinerary.setStartTime("07:00");

        itinerary.setEndTime("20:00");

        List<FoodTourStop> stops = new ArrayList<>();

        List<FoodPlace> selectedPlaces = new ArrayList<>();

        int totalCost = 0;

        // 4. Chọn địa điểm cho từng hoạt động
        for (TourActivity activity : activities) {

            FoodPlace selectedPlace = findBestPlace(
                    allPlaces,
                    selectedPlaces,
                    activity,
                    district,
                    budget - totalCost,
                    stops
            );

            // Không tìm được quán phù hợp thì bỏ qua
            if (selectedPlace == null) {
                continue;
            }

            int estimatedCost =
                    calculateEstimatedCost(selectedPlace);

            // 5. Tạo điểm dừng
            FoodTourStop stop = new FoodTourStop();

            stop.setSequence(stops.size() + 1);

            stop.setActivity(activity.name);

            stop.setVisitTime(activity.time);

            stop.setDurationMinutes(60);

            stop.setEstimatedCost(estimatedCost);

            // Tính khoảng cách từ địa điểm trước
            if (!stops.isEmpty()) {

                FoodPlace previousPlace =
                        stops.get(stops.size() - 1)
                                .getFoodPlace();

                stop.setDistanceFromPrevious(
                        calculateDistance(
                                previousPlace,
                                selectedPlace
                        )
                );

            } else {

                stop.setDistanceFromPrevious(0.0);
            }

            stop.setFoodPlace(selectedPlace);

            stops.add(stop);

            selectedPlaces.add(selectedPlace);

            totalCost += estimatedCost;
        }

        // 6. Đóng gói lịch trình
        itinerary.setStops(stops);

        itinerary.setTotalStops(stops.size());

        itinerary.setTotalEstimatedCost(totalCost);

        itinerary.setRemainingBudget(
                budget - totalCost
        );

        return itinerary;
    }


    // =====================================
    // 2. NHẬN DIỆN HOẠT ĐỘNG
    // =====================================


    private List<TourActivity> detectActivities(
            String message
    ) {

        List<TourActivity> activities = new ArrayList<>();

        if (containsPhrase(
                message,
                "an sang",
                "buoi sang",
                "diem tam"
        )) {
            activities.add(new TourActivity(
                    "Ăn sáng",
                    new String[]{
                            "mon nuoc",
                            "pho",
                            "bun",
                            "hu tieu",
                            "banh mi",
                            "an sang"
                    },
                    "07:00 - 08:00"
            ));
        }

        if (containsPhrase(
                message,
                "an trua",
                "buoi trua"
        )) {
            activities.add(new TourActivity(
                    "Ăn trưa",
                    new String[]{
                            "com",
                            "mon nuoc",
                            "mon chinh"
                    },
                    "11:00 - 12:00"
            ));
        }

        if (containsPhrase(
                message,
                "an vat",
                "an nhe",
                "buoi chieu"
        )) {
            activities.add(new TourActivity(
                    "Ăn vặt",
                    new String[]{
                            "an vat",
                            "banh trang",
                            "banh ngot",
                            "che"
                    },
                    "14:00 - 15:00"
            ));
        }

        if (containsPhrase(
                message,
                "ca phe",
                "cafe",
                "coffee"
        )) {
            activities.add(new TourActivity(
                    "Uống cà phê",
                    new String[]{
                            "ca phe",
                            "cafe",
                            "coffee"
                    },
                    "16:00 - 17:00"
            ));
        }

        if (containsPhrase(
                message,
                "an toi",
                "buoi toi"
        )) {
            activities.add(new TourActivity(
                    "Ăn tối",
                    new String[]{
                            "lau",
                            "hai san",
                            "do nuong",
                            "com",
                            "mon nuoc"
                    },
                    "18:00 - 19:00"
            ));
        }

        // Không ghi rõ bữa ăn:
        // Tự động tạo Food Tour mặc định
        if (activities.isEmpty()) {

            activities.add(new TourActivity(
                    "Ăn sáng",
                    new String[]{"pho", "bun", "banh mi"},
                    "07:00 - 08:00"
            ));

            activities.add(new TourActivity(
                    "Ăn trưa",
                    new String[]{"com", "mon nuoc"},
                    "11:00 - 12:00"
            ));

            activities.add(new TourActivity(
                    "Ăn vặt",
                    new String[]{"an vat", "banh trang", "che"},
                    "14:00 - 15:00"
            ));

            activities.add(new TourActivity(
                    "Uống cà phê",
                    new String[]{"ca phe", "cafe", "coffee"},
                    "16:00 - 17:00"
            ));

            activities.add(new TourActivity(
                    "Ăn tối",
                    new String[]{"lau", "hai san", "com"},
                    "18:00 - 19:00"
            ));
        }

        return activities;
    }


    // Kiểm tra từ hoặc cụm từ độc lập
    private boolean containsPhrase(
            String message,
            String... phrases
    ) {

        for (String phrase : phrases) {

            String regex = "(?<![a-z0-9])"
                    + java.util.regex.Pattern.quote(phrase)
                    + "(?![a-z0-9])";

            if (java.util.regex.Pattern
                    .compile(regex)
                    .matcher(message)
                    .find()) {
                return true;
            }
        }

        return false;
    }



    // =====================================
    // 3. TÌM QUÁN ĂN PHÙ HỢP
    // =====================================

    private FoodPlace findBestPlace(
            List<FoodPlace> allPlaces,
            List<FoodPlace> selectedPlaces,
            TourActivity activity,
            String district,
            int remainingBudget,
            List<FoodTourStop> stops
    ) {

        FoodPlace bestPlace = null;

        double bestScore = Double.MAX_VALUE;

        FoodPlace previousPlace = null;

        if (!stops.isEmpty()) {
            previousPlace = stops.get(
                    stops.size() - 1
            ).getFoodPlace();
        }

        for (FoodPlace place : allPlaces) {

            // Không chọn trùng quán
            if (selectedPlaces.contains(place)) {
                continue;
            }

            // Kiểm tra giá tiền
            if (place.getPriceMin() == null
                    || place.getPriceMax() == null) {
                continue;
            }

            if (place.getPriceMin() < 0
                    || place.getPriceMax() < place.getPriceMin()) {
                continue;
            }

            int cost = calculateEstimatedCost(place);

            // Không vượt ngân sách còn lại
            if (cost > remainingBudget) {
                continue;
            }

            // Kiểm tra khu vực nếu người dùng yêu cầu
            if (district != null
                    && (place.getDistrict() == null
                    || !place.getDistrict()
                    .equalsIgnoreCase(district))) {
                continue;
            }

            // Kiểm tra loại món
            if (!matchesActivity(place, activity)) {
                continue;
            }

            // Tính điểm ưu tiên
            double score = 0;

            // Ưu tiên giá thấp hơn
            score += cost;

            // Ưu tiên quán gần địa điểm trước
            if (previousPlace != null) {

                Double distance = calculateDistance(
                        previousPlace,
                        place
                );

                if (distance != null) {
                    score += distance * 10000;
                } else {
                    score += 100000;
                }
            }

            if (score < bestScore) {
                bestScore = score;
                bestPlace = place;
            }
        }

        return bestPlace;
    }


    // =====================================
    // 4. KIỂM TRA LOẠI ĐỊA ĐIỂM
    // =====================================

    private boolean matchesActivity(
            FoodPlace place,
            TourActivity activity
    ) {

        String information = normalize(
                (place.getCuisineType() == null ? "" :
                        place.getCuisineType())
                        + " "
                        + (place.getName() == null ? "" :
                        place.getName())
                        + " "
                        + (place.getDescription() == null ? "" :
                        place.getDescription())
        );

        for (String keyword : activity.keywords) {

            if (information.contains(normalize(keyword))) {
                return true;
            }
        }

        return false;
    }


    // =====================================
    // 5. TÍNH CHI PHÍ DỰ KIẾN
    // =====================================

    private int calculateEstimatedCost(
            FoodPlace place
    ) {

        long min = place.getPriceMin();

        long max = place.getPriceMax();

        return (int) ((min + max) / 2);
    }


    // =====================================
    // 6. TÍNH KHOẢNG CÁCH HAVERSINE
    // =====================================

    private Double calculateDistance(
            FoodPlace first,
            FoodPlace second
    ) {

        BigDecimal lat1 = first.getLatitude();
        BigDecimal lon1 = first.getLongitude();

        BigDecimal lat2 = second.getLatitude();
        BigDecimal lon2 = second.getLongitude();

        // Thiếu tọa độ
        if (lat1 == null || lon1 == null
                || lat2 == null || lon2 == null) {
            return null;
        }

        double earthRadius = 6371;

        double latitude1 = Math.toRadians(
                lat1.doubleValue()
        );

        double latitude2 = Math.toRadians(
                lat2.doubleValue()
        );

        double deltaLatitude = Math.toRadians(
                lat2.doubleValue() - lat1.doubleValue()
        );

        double deltaLongitude = Math.toRadians(
                lon2.doubleValue() - lon1.doubleValue()
        );

        double a = Math.sin(deltaLatitude / 2)
                * Math.sin(deltaLatitude / 2)
                + Math.cos(latitude1)
                * Math.cos(latitude2)
                * Math.sin(deltaLongitude / 2)
                * Math.sin(deltaLongitude / 2);

        double c = 2 * Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
        );

        return earthRadius * c;
    }


    // =====================================
    // 7. CHUẨN HÓA CHUỖI
    // =====================================

    private String normalize(String text) {

        String normalized =
                java.text.Normalizer.normalize(
                        text.toLowerCase(Locale.ROOT),
                        java.text.Normalizer.Form.NFD
                );

        normalized = normalized.replaceAll(
                "\\p{M}", ""
        );

        return normalized.replace("đ", "d");
    }

}
