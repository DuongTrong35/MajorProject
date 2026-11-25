package com.example.MajorProject.Service;


import com.example.MajorProject.Model.ChatbotKnowledge;
import com.example.MajorProject.Model.DTO.ChatResponse;
import com.example.MajorProject.Model.FoodPlace;
import com.example.MajorProject.Model.FoodTourItinerary;
import com.example.MajorProject.Model.FoodTourStop;
import com.example.MajorProject.Repository.ChatbotKnowledgeRepository;
import com.example.MajorProject.Repository.FoodPlaceRepository;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatService {

    private final FoodPlaceRepository foodPlaceRepository;
    private final ChatbotKnowledgeRepository chatbotKnowledgeRepository;

    private boolean isFoodRelated(String message) {
        String normalized = normalize(message);

        String[] keywords = {
                "an gi",
                "mon an",
                "quan an",
                "am thuc",
                "food tour",
                "foodtour",
                "du lich am thuc",
                "dia diem an uong",
                "nha hang",
                "quan cafe",
                "ca phe",
                "an vat",
                "ngan sach",
                "lich trinh an uong",
                "lap lich trinh",
                "goi y quan",
                "tim quan",
                "mon nuoc",
                "hai san",
                "mon chay",
                "banh ngot"
        };

        for (String keyword : keywords) {
            if (normalized.contains(keyword)) {
                return true;
            }
        }

        return false;
    }

    private final FoodTourPlannerService foodTourPlannerService;
    public ChatService(
            FoodPlaceRepository foodPlaceRepository,
            ChatbotKnowledgeRepository chatbotKnowledgeRepository,
            FoodTourPlannerService foodTourPlannerService
    ) {
        this.foodPlaceRepository = foodPlaceRepository;
        this.chatbotKnowledgeRepository = chatbotKnowledgeRepository;
        this.foodTourPlannerService = foodTourPlannerService;
    }

    // =====================================
    // 1. XỬ LÝ CÂU HỎI CHATBOT
    // =====================================


    public ChatResponse processMessage(String message) {

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException(
                    "Vui lòng nhập nội dung câu hỏi!"
            );
        }

        // 1. Chuẩn hóa nội dung
        String normalizedMessage = normalize(message);

// 2. Nhận diện ý định giao tiếp NGAY SAU KHI CHUẨN HÓA
        String intent = detectIntent(normalizedMessage);

// Không liên quan đến Food Tour hoặc ẩm thực
//        if (!isFoodRelated(normalizedMessage)) {
//            ChatResponse response = new ChatResponse();
//
//            response.setReply(
//                    "Xin lỗi 😅 Mình là trợ lý Food Tour Sài Gòn, " +
//                            "chuyên hỗ trợ tìm kiếm địa điểm ăn uống và lập lịch trình " +
//                            "khám phá ẩm thực theo ngân sách của bạn.\n\n" +
//                            "Bạn có thể thử:\n" +
//                            "🍜 Tìm quán ăn ngon ở Quận 1.\n" +
//                            "🗺️ Lập Food Tour Sài Gòn với ngân sách 500.000 VNĐ.\n" +
//                            "☕ Gợi ý quán cà phê và ăn vặt."
//            );
//
//            response.setFoodPlaces(new ArrayList<>());
//            response.setKnowledge(new ArrayList<>());
//            response.setItinerary(null);
//
//            return response;
//        }

        // 2. Nhận diện ý định giao tiếp
//        String intent = detectIntent(normalizedMessage);

        // 3. Nhận diện thông tin người dùng
        String district = detectDistrict(normalizedMessage);

        String cuisineType = detectCuisineType(normalizedMessage);

        Integer budget = detectBudget(normalizedMessage);

        String budgetMode = detectBudgetMode(normalizedMessage);

        // 4. Kiểm tra người dùng có đang yêu cầu tìm món ăn không
        boolean isFoodTour = isFoodTourRequest(
                normalizedMessage
        );

        boolean isFoodRequest =
                isFoodTour ||
                        district != null ||
                        cuisineType != null ||
                        budget != null ||
                        containsPhrase(
                                normalizedMessage,
                                "an gi",
                                "mon an",
                                "mon nao",
                                "co mon nao",
                                "tim mon",
                                "goi y mon",
                                "quan an",
                                "quan nao",
                                "tim quan",
                                "an uong",
                                "dia diem an"
                        );

        // 5. Xử lý giao tiếp thông thường
        if (intent != null && !isFoodRequest) {

            ChatResponse response = new ChatResponse();

            response.setReply(generateIntentReply(intent));
            response.setDetectedDistrict(null);
            response.setDetectedCuisineType(null);
            response.setDetectedBudget(null);
            response.setFoodPlaces(List.of());
            response.setKnowledge(List.of());

            return response;
        }

// 6. Chỉ từ chối khi không phải giao tiếp
// thông thường và không liên quan đến Food Tour
        if (!isFoodRelated(normalizedMessage) && !isFoodRequest) {

            ChatResponse response = new ChatResponse();

            response.setReply(
                    "Xin lỗi 😅 Mình là trợ lý Food Tour Sài Gòn, " +
                            "chuyên hỗ trợ tìm kiếm địa điểm ăn uống và lập lịch trình " +
                            "khám phá ẩm thực theo ngân sách của bạn.\n\n" +
                            "Bạn có thể thử:\n" +
                            "🍜 Tìm quán ăn ngon ở Quận 1.\n" +
                            "🗺️ Lập Food Tour Sài Gòn với ngân sách 500.000 VNĐ.\n" +
                            "☕ Gợi ý quán cà phê và ăn vặt."
            );

            response.setFoodPlaces(List.of());
            response.setKnowledge(List.of());
            response.setItinerary(null);

            return response;
        }

        // =====================================
// 6. XỬ LÝ YÊU CẦU LẬP FOOD TOUR
// =====================================

        if (isFoodTour) {

            return processFoodTour(
                    normalizedMessage,
                    district,
                    budget
            );
        }
        // 6. Tìm kiếm địa điểm ăn uống
        List<FoodPlace> foodPlaces = searchFoodPlaces(
                district,
                cuisineType,
                budget,
                budgetMode
        );

        // 7. Tìm kiến thức chatbot
        List<ChatbotKnowledge> knowledge = searchKnowledge(
                normalizedMessage
        );

        // 8. Tạo câu trả lời
        String reply = generateReply(
                foodPlaces,
                knowledge,
                district,
                cuisineType,
                budget,
                budgetMode
        );

        // 9. Đóng gói kết quả
        ChatResponse response = new ChatResponse();

        response.setReply(reply);
        response.setDetectedDistrict(district);
        response.setDetectedCuisineType(cuisineType);
        response.setDetectedBudget(budget);
        response.setFoodPlaces(foodPlaces);
        response.setKnowledge(knowledge);

        return response;
    }


    // =====================================
    // 2. CHUẨN HÓA TIẾNG VIỆT
    // =====================================

    private String normalize(String text) {

        String normalized = Normalizer.normalize(
                text.toLowerCase(),
                Normalizer.Form.NFD
        );

        normalized = normalized.replaceAll("\\p{M}", "");

        normalized = normalized.replace("đ", "d");

        return normalized;
    }


// =====================================
// NHẬN DIỆN Ý ĐỊNH GIAO TIẾP
// =====================================


    private String detectIntent(String message) {

        // 1. Hỏi thăm sức khỏe
        if (containsPhrase(message,
                "ban khoe khong",
                "khoe khong",
                "ban co khoe khong",
                "hom nay ban the nao",
                "how are you",
                "how are you doing")) {
            return "HOW_ARE_YOU";
        }

        // 2. Từ chối sự giúp đỡ
        if (containsPhrase(message,
                "khong can dau",
                "khong can giup",
                "khong can ban giup",
                "toi khong can giup gi",
                "toi khong muon giup gi",
                "khong muon duoc giup",
                "thoi khoi",
                "thoi khong can",
                "khong can nua",
                "minh tu lam duoc",
                "toi tu lam duoc",
                "de toi tu lam",
                "khong phai dau",
                "khong can ho tro")) {
            return "NO_HELP";
        }

        // 3. Hỏi chatbot là ai
        if (containsPhrase(message,
                "ban la ai",
                "ban ten gi",
                "ten cua ban",
                "ban la chatbot gi",
                "who are you")) {
            return "BOT_IDENTITY";
        }

        // 4. Hỏi chatbot có thể làm gì
        if (containsPhrase(message,
                "ban co the lam gi",
                "ban giup duoc gi",
                "ban co the giup gi",
                "ban biet lam gi",
                "ban co chuc nang gi",
                "what can you do")) {
            return "BOT_CAPABILITY";
        }

        // 5. Cảm ơn
        if (containsPhrase(message,
                "cam on",
                "cam on ban",
                "cam on nhe",
                "cam on nhieu",
                "cam on rat nhieu",
                "thanks",
                "thank you",
                "thank you so much",
                "tks",
                "thx")) {
            return "THANKS";
        }

        // 6. Xin lỗi
        if (containsPhrase(message,
                "xin loi",
                "minh xin loi",
                "toi xin loi",
                "sorry",
                "my bad")) {
            return "APOLOGY";
        }

        // 7. Khen ngợi
        if (containsPhrase(message,
                "ban gioi qua",
                "ban thong minh qua",
                "ban de thuong qua",
                "ban tuyet voi",
                "ban rat huu ich",
                "tra loi hay qua",
                "good job",
                "great job",
                "you are amazing")) {
            return "COMPLIMENT";
        }

        // 8. Không đồng ý
        if (containsPhrase(message,
                "khong dung",
                "sai roi",
                "khong phai",
                "khong chinh xac",
                "toi khong dong y",
                "minh khong dong y",
                "no")) {
            return "DISAGREEMENT";
        }

        // 9. Đồng ý
        if (containsPhrase(message,
                "dung roi",
                "chinh xac",
                "chuan roi",
                "chuan luon",
                "ban noi dung",
                "toi dong y",
                "minh dong y",
                "exactly")) {
            return "AGREEMENT";
        }

        // 9. Trả lời phủ định ngắn
        if (containsPhrase(message,
                "khong",
                "khong nhe",
                "khong dau",
                "khong can",
                "khong muon",
                "khong phai",
                "no",
                "no thanks",
                "no thank you")) {
            return "NEGATIVE_RESPONSE";
        }

        // 10. Xác nhận
        if (containsPhrase(message,
                "ok",
                "okay",
                "oke",
                "duoc roi",
                "hieu roi",
                "da hieu",
                "got it",
                "alright")) {
            return "ACKNOWLEDGEMENT";
        }

        // 11. Không hiểu
        if (containsPhrase(message,
                "toi khong hieu",
                "minh khong hieu",
                "khong hieu gi ca",
                "y ban la gi",
                "y cua ban la gi",
                "la sao",
                "what do you mean")) {
            return "CONFUSION";
        }

        // 12. Yêu cầu nhắc lại
        if (containsPhrase(message,
                "noi lai di",
                "noi lai duoc khong",
                "nhac lai di",
                "giai thich lai",
                "ban noi lai di",
                "repeat please")) {
            return "REPEAT";
        }

        // 13. Tạm biệt
        if (containsPhrase(message,
                "tam biet",
                "hen gap lai",
                "bye",
                "goodbye",
                "see you",
                "good night")) {
            return "GOODBYE";
        }

        // 14. Chào hỏi
        if (containsPhrase(message,
                "xin chao",
                "chao ban",
                "chao buoi sang",
                "chao buoi chieu",
                "chao buoi toi",
                "chao",
                "hello",
                "hi",
                "hey",
                "he lo",
                "helo",
                "alo",
                "lo")) {
            return "GREETING";
        }

        // 15. Trò chuyện thông thường
        if (containsPhrase(message,
                "ban dang lam gi",
                "hom nay troi dep",
                "hom nay the nao",
                "toi buon qua",
                "toi vui qua",
                "ke chuyen cho toi",
                "noi chuyen voi toi",
                "ban co ranh khong",
                "im lonely",
                "tell me a story")) {
            return "SMALL_TALK";
        }

        return null;
    }



    // Kiểm tra cụm từ độc lập, tránh nhận diện nhầm
    private boolean containsPhrase(String message, String... phrases) {

        for (String phrase : phrases) {

            String regex = "(?<![a-z0-9])"
                    + Pattern.quote(phrase)
                    + "(?![a-z0-9])";

            if (Pattern.compile(regex).matcher(message).find()) {
                return true;
            }
        }

        return false;
    }


// =====================================
// TẠO CÂU TRẢ LỜI GIAO TIẾP
// =====================================

    private String generateIntentReply(String intent) {

        switch (intent) {

//            case "GREETING":
//                return "Xin chào bạn! 👋\n\n"
//                        + "Mình là trợ lý AI Food Tour Sài Gòn. "
//                        + "Mình có thể giúp bạn khám phá những món ăn ngon, "
//                        + "tìm kiếm quán ăn và gợi ý địa điểm ẩm thực "
//                        + "phù hợp với sở thích của bạn.\n\n"
//                        + "Hôm nay bạn muốn khám phá món gì nào? 🍜";
            case "GREETING":
                return "Chào bạn! 👋 Rất vui được trò chuyện cùng bạn. "
                        + "Hôm nay bạn thế nào? Mình có thể giúp gì cho bạn? 😊";
            case "HOW_ARE_YOU":
                return "Mình vẫn luôn khỏe và sẵn sàng đồng hành "
                        + "cùng bạn khám phá ẩm thực Sài Gòn! 😄\n\n"
                        + "Còn bạn thì sao? Hôm nay bạn muốn đi ăn món gì?";

            case "BOT_IDENTITY":
                return "Mình là trợ lý AI Food Tour Sài Gòn! 🤖\n\n"
                        + "Mình có thể hỗ trợ bạn:\n"
                        + "🍜 Tìm kiếm món ăn ngon.\n"
                        + "📍 Khám phá địa điểm ăn uống.\n"
                        + "💰 Gợi ý quán ăn theo ngân sách.\n"
                        + "🗺️ Tìm kiếm địa điểm theo khu vực.\n\n"
                        + "Hãy cho mình biết bạn đang muốn tìm gì nhé!";

            case "THANKS":
                return "Không có gì đâu bạn! ❤️\n\n"
                        + "Mình rất vui khi có thể giúp bạn "
                        + "khám phá những địa điểm ăn uống thú vị tại Sài Gòn.";

            case "GOODBYE":
                return "Tạm biệt bạn nhé! 👋\n\n"
                        + "Chúc bạn có những trải nghiệm ẩm thực thật tuyệt vời. "
                        + "Hẹn gặp lại bạn trong chuyến Food Tour tiếp theo! ❤️";


            case "NO_HELP":
                return "Không sao đâu bạn! 😊\n\n"
                        + "Mình luôn sẵn sàng ở đây nếu bạn cần. "
                        + "Khi nào muốn tìm quán ăn ngon hoặc khám phá "
                        + "Food Tour Sài Gòn thì cứ nhắn mình nhé! ❤️";

            case "APOLOGY":
                return "Không sao đâu bạn! 😊 "
                        + "Bạn không cần phải xin lỗi mình đâu. "
                        + "Mình luôn sẵn sàng hỗ trợ bạn!";

            case "COMPLIMENT":
                return "Cảm ơn bạn nhiều nhé! 🥰 "
                        + "Được bạn khen mình vui lắm! "
                        + "Mình sẽ cố gắng hỗ trợ bạn thật tốt.";

            case "BOT_CAPABILITY":
                return "Mình là trợ lý AI Food Tour Sài Gòn! 🤖\n\n"
                        + "Mình có thể giúp bạn:\n"
                        + "🍜 Tìm kiếm quán ăn và món ngon.\n"
                        + "📍 Tìm địa điểm theo khu vực, quận.\n"
                        + "💰 Gợi ý quán theo ngân sách.\n"
                        + "🗺️ Lập lịch trình Food Tour tự động.\n"
                        + "🍽️ Khám phá các địa điểm ẩm thực Sài Gòn.\n\n"
                        + "Bạn muốn thử chức năng nào trước?";

            case "ACKNOWLEDGEMENT":
                return "Oki bạn nhé! 😊 "
                        + "Nếu cần mình hỗ trợ thêm điều gì thì cứ nói nhé.";

            case "AGREEMENT":
                return "Tuyệt vời! 😄 "
                        + "Vậy chúng ta thống nhất như thế nhé!";

            case "DISAGREEMENT":
                return "Ồ, có vẻ mình đã hiểu chưa đúng ý bạn rồi! 😅\n\n"
                        + "Bạn có thể nói rõ hơn điều bạn muốn không? "
                        + "Mình sẽ cố gắng điều chỉnh câu trả lời.";

            case "CONFUSION":
                return "Không sao đâu bạn! 😊 "
                        + "Mình sẽ cố gắng giải thích dễ hiểu hơn. "
                        + "Bạn đang chưa rõ phần nào vậy?";

            case "REPEAT":
                return "Được chứ! 😊 "
                        + "Bạn muốn mình nhắc lại nội dung nào? "
                        + "Hãy nói rõ phần cần giải thích lại nhé.";

            case "SMALL_TALK":
                return "Mình rất vui khi được trò chuyện cùng bạn! 😊\n\n"
                        + "Mình luôn sẵn sàng lắng nghe và đồng hành "
                        + "cùng bạn. Hôm nay của bạn thế nào rồi?";

            case "NEGATIVE_RESPONSE":
                return "Oki bạn nhé! 😊 Không sao đâu. "
                        + "Nếu cần hỗ trợ tìm kiếm địa điểm ăn uống "
                        + "hay lập Food Tour thì cứ nhắn mình nhé! ❤️";

            default:
                return null;
        }
    }

    // =====================================
    // 3. NHẬN DIỆN QUẬN
    // =====================================

    private String detectDistrict(String message) {

        Pattern pattern = Pattern.compile(
                "(?:quan|q)\\s*(\\d{1,2})"
        );

        Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            return "Quận " + matcher.group(1);
        }

        return null;
    }


    // =====================================
    // 4. NHẬN DIỆN LOẠI MÓN ĂN
    // =====================================

    private String detectCuisineType(String message) {

        if (containsAny(message, "nuong", "bbq")) {
            return "Đồ nướng";
        }

        if (containsAny(message, "lau")) {
            return "Lẩu";
        }

        if (containsAny(message, "hai san")) {
            return "Hải sản";
        }

        if (containsAny(message, "chay")) {
            return "Món chay";
        }

        if (containsAny(message, "banh ngot", "tra sua", "che")) {
            return "Bánh ngọt";
        }

        if (containsAny(message, "ca phe", "cafe", "coffee")) {
            return "Cà phê";
        }

        if (containsAny(message, "an vat", "banh trang")) {
            return "Ăn vặt";
        }

        if (containsAny(message, "bun", "pho", "hu tieu", "mi")) {
            return "Món nước";
        }

        return null;
    }


    private boolean containsAny(String message, String... keywords) {

        for (String keyword : keywords) {

            if (message.contains(keyword)) {
                return true;
            }
        }

        return false;
    }


    // =====================================
    // 5. NHẬN DIỆN NGÂN SÁCH
    // =====================================



    private Integer detectBudget(String message) {

        // Dạng: 200k, 200 nghìn, 1.5 triệu
        Pattern shortPattern = Pattern.compile(
                "(\\d+(?:[.,]\\d+)?)\\s*(k|nghin|ngan|trieu|tr)\\b"
        );

        Matcher shortMatcher = shortPattern.matcher(message);

        if (shortMatcher.find()) {

            double number = Double.parseDouble(
                    shortMatcher.group(1).replace(",", ".")
            );

            String unit = shortMatcher.group(2);

            if (unit.equals("k") ||
                    unit.equals("nghin") ||
                    unit.equals("ngan")) {

                return (int) (number * 1000);
            }

            return (int) (number * 1000000);
        }

        // Dạng: 200.000 hoặc 200,000
        Pattern fullPattern = Pattern.compile(
                "(?<!\\d)(\\d{1,3}(?:[.,]\\d{3})+)(?!\\d)"
        );

        Matcher fullMatcher = fullPattern.matcher(message);

        if (fullMatcher.find()) {

            String number = fullMatcher.group(1)
                    .replace(".", "")
                    .replace(",", "");

            return Integer.parseInt(number);
        }

        // Dạng: 200000 đồng, 200000 VNĐ
        Pattern normalPattern = Pattern.compile(
                "\\b(\\d{5,8})\\s*(dong|vnd)?\\b"
        );

        Matcher normalMatcher = normalPattern.matcher(message);

        if (normalMatcher.find()) {
            return Integer.parseInt(normalMatcher.group(1));
        }

        return null;
    }


// =====================================
// XÁC ĐỊNH KIỂU NGÂN SÁCH
// =====================================

    private String detectBudgetMode(String message) {

        // Ngân sách tối đa
        if (containsPhrase(
                message,
                "duoi",
                "toi da",
                "khong qua",
                "khong hon",
                "it hon"
        )) {
            return "MAX";
        }

        // Ngân sách ước lượng
        if (containsPhrase(
                message,
                "khoang",
                "tam",
                "xap xi",
                "quanh muc",
                "gan muc"
        )) {
            return "APPROX";
        }

        // Mặc định: xem là ngân sách tối đa
        return "MAX";
    }

    // =====================================
    // 6. TÌM KIẾM ĐỊA ĐIỂM ĂN UỐNG
    // =====================================


    private List<FoodPlace> searchFoodPlaces(
            String district,
            String cuisineType,
            Integer budget,
            String budgetMode
    ) {

        List<FoodPlace> results;

        // 1. Tìm theo quận và loại món
        if (district != null && cuisineType != null) {

            results = foodPlaceRepository
                    .findByDistrictContainingIgnoreCaseAndCuisineTypeContainingIgnoreCaseAndIsActiveTrue(
                            district,
                            cuisineType
                    );

        } else if (district != null) {

            results = foodPlaceRepository
                    .findByDistrictContainingIgnoreCaseAndIsActiveTrue(
                            district
                    );

        } else if (cuisineType != null) {

            results = foodPlaceRepository
                    .findByCuisineTypeContainingIgnoreCaseAndIsActiveTrue(
                            cuisineType
                    );

        } else {

            // Chưa chọn loại món:
            // Lấy tất cả địa điểm đang hoạt động
            results = foodPlaceRepository.findByIsActiveTrue();
        }

        // 2. Lọc theo ngân sách
        if (budget != null) {

            results = results.stream()

                    .filter(place -> {

                        Integer min = place.getPriceMin();
                        Integer max = place.getPriceMax();

                        // Không đủ dữ liệu giá thì bỏ qua
                        if (min == null || max == null) {
                            return false;
                        }

                        if (budgetMode.equals("MAX")) {

                            // Toàn bộ khoảng giá không vượt ngân sách
                            return max <= budget;

                        } else {

                            // Ngân sách khoảng:
                            // Chấp nhận dao động 20%
                            int lowerBudget = (int) (budget * 0.8);
                            int upperBudget = (int) (budget * 1.2);

                            return min <= upperBudget
                                    && max >= lowerBudget;
                        }
                    })

                    .sorted((a, b) -> {

                        // Sắp xếp theo mức độ phù hợp
                        long middleA = (
                                (long) a.getPriceMin()
                                        + a.getPriceMax()
                        ) / 2;

                        long middleB = (
                                (long) b.getPriceMin()
                                        + b.getPriceMax()
                        ) / 2;

                        if (budgetMode.equals("MAX")) {

                            // Ưu tiên quán có giá thấp
                            return Integer.compare(
                                    a.getPriceMax(),
                                    b.getPriceMax()
                            );
                        }

                        // Ưu tiên giá gần ngân sách
                        return Long.compare(
                                Math.abs(middleA - budget),
                                Math.abs(middleB - budget)
                        );
                    })

                    .toList();
        }

        return results;
    }



    // =====================================
    // 7. TÌM KIẾM KIẾN THỨC CHATBOT
    // =====================================

    private List<ChatbotKnowledge> searchKnowledge(
            String message
    ) {

        List<ChatbotKnowledge> allKnowledge =
                chatbotKnowledgeRepository.findByIsActiveTrue();

        return allKnowledge.stream()
                .filter(item -> {

                    String question = normalize(
                            item.getQuestion() == null
                                    ? ""
                                    : item.getQuestion()
                    );

                    String keywords = normalize(
                            item.getKeywords() == null
                                    ? ""
                                    : item.getKeywords()
                    );

                    if (!question.isEmpty() &&
                            message.contains(question)) {
                        return true;
                    }

                    if (!keywords.isEmpty()) {

                        String[] keywordList =
                                keywords.split("[,;]");

                        for (String keyword : keywordList) {

                            String cleanKeyword = keyword.trim();

                            if (cleanKeyword.length() >= 2 &&
                                    message.contains(cleanKeyword)) {
                                return true;
                            }
                        }
                    }

                    return false;
                })
                .sorted(Comparator.comparing(
                        ChatbotKnowledge::getId
                ))
                .limit(5)
                .toList();
    }


    // =====================================
    // 8. TẠO CÂU TRẢ LỜI
    // =====================================


    private String generateReply(
            List<FoodPlace> foodPlaces,
            List<ChatbotKnowledge> knowledge,
            String district,
            String cuisineType,
            Integer budget,
            String budgetMode
    ) {

        StringBuilder reply = new StringBuilder();

        reply.append("Mình đã tìm kiếm những địa điểm phù hợp ")
                .append("với nhu cầu của bạn! 😊\n\n");

        // 1. Hiển thị khu vực
        if (district != null) {

            reply.append("📍 Khu vực: ")
                    .append(district)
                    .append("\n");
        }

        // 2. Hiển thị loại món
        if (cuisineType != null) {

            reply.append("🍽️ Loại món: ")
                    .append(cuisineType)
                    .append("\n");

        } else if (budget != null) {

            reply.append("🍽️ Loại món: ")
                    .append("Nhiều loại món ăn phù hợp")
                    .append("\n");
        }

        // 3. Hiển thị ngân sách
        if (budget != null) {

            reply.append("💰 Ngân sách: ");

            if (budgetMode.equals("MAX")) {

                reply.append("Tối đa ");

            } else {

                reply.append("Khoảng ");
            }

            reply.append(String.format("%,d VNĐ", budget))
                    .append("\n");
        }

        // 4. Hiển thị địa điểm
        if (!foodPlaces.isEmpty()) {

            reply.append("\n🎉 Mình tìm thấy ")
                    .append(foodPlaces.size())
                    .append(" địa điểm phù hợp:\n\n");

            for (int i = 0; i < foodPlaces.size(); i++) {

                FoodPlace place = foodPlaces.get(i);

                reply.append(i + 1)
                        .append(". ")
                        .append(place.getName())
                        .append("\n");

                if (place.getCuisineType() != null) {

                    reply.append("🍜 Loại món: ")
                            .append(place.getCuisineType())
                            .append("\n");
                }

                reply.append("📍 Địa chỉ: ")
                        .append(place.getAddress())
                        .append("\n");

                if (place.getPriceMin() != null &&
                        place.getPriceMax() != null) {

                    reply.append("💰 Giá tham khảo: ")
                            .append(String.format(
                                    "%,d - %,d VNĐ",
                                    place.getPriceMin(),
                                    place.getPriceMax()
                            ))
                            .append("\n");
                }

                if (place.getGoogleMapsUrl() != null) {

                    reply.append("🗺️ Bản đồ: ")
                            .append(place.getGoogleMapsUrl())
                            .append("\n");
                }

                reply.append("\n");
            }

        } else {

            reply.append("\nHiện tại mình chưa tìm thấy ")
                    .append("địa điểm phù hợp với ngân sách hoặc ")
                    .append("điều kiện tìm kiếm của bạn.\n");

            reply.append("Bạn có thể thử tăng ngân sách ")
                    .append("hoặc thay đổi loại món ăn nhé!\n\n");
        }

        // 5. Chủ động hỏi thêm khu vực
        if (district == null) {

            reply.append("\n📍 Bạn muốn tìm quán ăn ở quận nào ")
                    .append("tại TP. Hồ Chí Minh? ")
                    .append("Mình có thể lọc địa điểm gần khu vực ")
                    .append("bạn muốn đến hơn nhé!");
        }

        // 6. Hiển thị kiến thức bổ sung
        if (!knowledge.isEmpty()) {

            reply.append("\n\n📚 Thông tin tham khảo:\n\n");

            for (ChatbotKnowledge item : knowledge) {

                reply.append(item.getAnswer())
                        .append("\n\n");
            }
        }

        return reply.toString();
    }

    // =====================================
// NHẬN DIỆN YÊU CẦU LẬP FOOD TOUR
// =====================================

    // =====================================
// NHẬN DIỆN YÊU CẦU LẬP FOOD TOUR
// =====================================

    private boolean isFoodTourRequest(String message) {

        return containsPhrase(
                message,

                // Food Tour
                "food tour",
                "foodtour",
                "tour an uong",
                "tour am thuc",
                "di an tour",
                "di tour an uong",

                // Lập lịch trình
                "lich trinh",
                "lap lich trinh",
                "sap xep lich trinh",
                "tao lich trinh",
                "xay dung lich trinh",

                // Hành trình
                "hanh trinh an uong",
                "cuoc hanh trinh",
                "hanh trinh",
                "lap hanh trinh",
                "tao hanh trinh",
                "xay dung hanh trinh",

                // Chuyến đi
                "chuyen di an uong",
                "lap chuyen di",
                "tao chuyen di"
        );
    }
    // =====================================
// XỬ LÝ LẬP LỊCH TRÌNH FOOD TOUR
// =====================================

    private ChatResponse processFoodTour(
            String normalizedMessage,
            String district,
            Integer budget
    ) {

        ChatResponse response = new ChatResponse();

        response.setDetectedDistrict(district);
        response.setDetectedCuisineType(null);
        response.setDetectedBudget(budget);
        response.setKnowledge(List.of());

        // Phải có ngân sách mới tính được lịch trình
        if (budget == null || budget <= 0) {

            response.setReply(
                    "Mình có thể giúp bạn lập lịch trình "
                            + "Food Tour Sài Gòn! 🍜\n\n"
                            + "Bạn hãy cho mình biết ngân sách dự kiến nhé.\n\n"
                            + "Ví dụ: Mình có 300k, hãy lập lịch trình "
                            + "Food Tour Sài Gòn từ 7 giờ sáng đến 8 giờ tối."
            );

            response.setFoodPlaces(List.of());

            response.setItinerary(null);

            return response;
        }

        // Tạo lịch trình bằng thuật toán Java
        FoodTourItinerary itinerary =
                foodTourPlannerService.createItinerary(
                        budget,
                        district,
                        normalizedMessage
                );

        response.setItinerary(itinerary);

        // Đồng bộ danh sách địa điểm cũ
        List<FoodPlace> selectedPlaces =
                itinerary.getStops()
                        .stream()
                        .map(FoodTourStop::getFoodPlace)
                        .toList();

        response.setFoodPlaces(selectedPlaces);

        // Tạo nội dung trả lời
        StringBuilder reply = new StringBuilder();

        reply.append("🎉 Mình đã xây dựng lịch trình ")
                .append("Food Tour Sài Gòn cho bạn!\n\n");

        reply.append("💰 Ngân sách: ")
                .append(String.format("%,d VNĐ", budget))
                .append("\n");

        reply.append("📍 Khu vực: ")
                .append(district == null
                        ? "TP. Hồ Chí Minh"
                        : district)
                .append("\n");

        reply.append("🍽️ Số địa điểm tìm được: ")
                .append(itinerary.getTotalStops())
                .append("\n\n");

        if (itinerary.getStops().isEmpty()) {

            reply.append(
                    "Hiện tại mình chưa tìm được địa điểm "
                            + "phù hợp với ngân sách và tiêu chí của bạn. "
                            + "Bạn hãy thử tăng ngân sách hoặc thay đổi khu vực nhé!"
            );

        } else {

            reply.append("🗓️ LỊCH TRÌNH FOOD TOUR\n\n");

            for (FoodTourStop stop : itinerary.getStops()) {

                FoodPlace place = stop.getFoodPlace();

                reply.append(stop.getSequence())
                        .append(". ")
                        .append(stop.getActivity())
                        .append("\n");

                reply.append("⏰ ")
                        .append(stop.getVisitTime())
                        .append("\n");

                reply.append("🍜 ")
                        .append(place.getName())
                        .append("\n");

                reply.append("📍 ")
                        .append(place.getAddress())
                        .append("\n");

                reply.append("💰 ")
                        .append(String.format(
                                "%,d VNĐ",
                                stop.getEstimatedCost()
                        ))
                        .append("\n");

                if (stop.getDistanceFromPrevious() != null
                        && stop.getSequence() > 1) {

                    reply.append("🚗 Khoảng cách đường chim bay: ")
                            .append(String.format(
                                    "%.2f km",
                                    stop.getDistanceFromPrevious()
                            ))
                            .append("\n");
                }

                reply.append("\n");
            }

            reply.append("💵 Tổng chi phí dự kiến: ")
                    .append(String.format(
                            "%,d VNĐ",
                            itinerary.getTotalEstimatedCost()
                    ))
                    .append("\n");

            reply.append("💳 Ngân sách còn lại: ")
                    .append(String.format(
                            "%,d VNĐ",
                            itinerary.getRemainingBudget()
                    ))
                    .append("\n");

            if (itinerary.getTotalStops() < 5) {

                reply.append("\n⚠️ Lịch trình chưa đủ 5 hoạt động ")
                        .append("do dữ liệu địa điểm phù hợp còn hạn chế. ")
                        .append("Bạn có thể thử tăng ngân sách hoặc ")
                        .append("mở rộng khu vực tìm kiếm.");
            }
        }

        response.setReply(reply.toString());

        return response;
    }


}
