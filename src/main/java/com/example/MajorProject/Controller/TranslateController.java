
package com.example.MajorProject.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/translate")
@CrossOrigin("*")
public class TranslateController {

    private final RestTemplate restTemplate = new RestTemplate();

    // Cache kết quả dịch để tránh gọi Google nhiều lần
    private final Map<String, String> translationCache =
            new ConcurrentHashMap<>();

    @GetMapping
    public ResponseEntity<?> translate(
            @RequestParam String text,
            @RequestParam(defaultValue = "en") String to
    ) {
        try {

            // Kiểm tra dữ liệu đầu vào
            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        Map.of("translatedText", "Vui lòng nhập văn bản")
                );
            }

            // Tạo key cache
            String cacheKey = to + ":" + text.trim();

            // Nếu đã dịch trước đó thì lấy từ cache
            if (translationCache.containsKey(cacheKey)) {
                return ResponseEntity.ok(
                        Map.of("translatedText",
                                translationCache.get(cacheKey))
                );
            }

            // URL Google Translate
            String url =
                    "https://translate.googleapis.com/translate_a/single"
                            + "?client=gtx&sl=auto&tl={to}&dt=t&q={text}";

            // Gọi Google Translate
            List<?> response = restTemplate.getForObject(
                    url,
                    List.class,
                    to,
                    text
            );

            StringBuilder translated = new StringBuilder();

            // Bóc tách kết quả JSON
            if (response != null
                    && !response.isEmpty()
                    && response.get(0) instanceof List) {

                List<?> sentences = (List<?>) response.get(0);

                for (Object sentenceObj : sentences) {

                    if (sentenceObj instanceof List) {

                        List<?> sentenceDetails =
                                (List<?>) sentenceObj;

                        if (!sentenceDetails.isEmpty()
                                && sentenceDetails.get(0) != null) {

                            translated.append(
                                    sentenceDetails.get(0).toString()
                            );
                        }
                    }
                }
            }

            if (translated.isEmpty()) {
                return ResponseEntity.status(502).body(
                        Map.of("translatedText",
                                "Google không trả về kết quả dịch")
                );
            }

            // Lưu kết quả vào cache
            translationCache.put(cacheKey, translated.toString());

            return ResponseEntity.ok(
                    Map.of("translatedText", translated.toString())
            );

        } catch (HttpClientErrorException.TooManyRequests e) {

            // Google giới hạn số lượng request
            return ResponseEntity.status(429).body(
                    Map.of("translatedText",
                            "Google đang giới hạn yêu cầu dịch. Vui lòng thử lại sau.")
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500).body(
                    Map.of("translatedText", "Translate lỗi API")
            );
        }
    }
}
