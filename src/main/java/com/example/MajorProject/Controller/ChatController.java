package com.example.MajorProject.Controller;




import com.example.MajorProject.Model.DTO.ChatRequest;
import com.example.MajorProject.Model.DTO.ChatResponse;
import com.example.MajorProject.Service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // POST: Gửi câu hỏi đến chatbot
    // POST /api/chat/send

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @RequestBody ChatRequest request
    ) {

        try {

            ChatResponse response = chatService.processMessage(
                    request.getMessage()
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}
