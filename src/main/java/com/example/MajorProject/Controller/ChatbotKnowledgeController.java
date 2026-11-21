package com.example.MajorProject.Controller;


import com.example.MajorProject.Model.ChatbotKnowledge;
import com.example.MajorProject.Service.ChatbotKnowledgeService;

import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/chatbot-knowledge")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatbotKnowledgeController {

    private final ChatbotKnowledgeService chatbotKnowledgeService;

    public ChatbotKnowledgeController(
            ChatbotKnowledgeService chatbotKnowledgeService
    ) {
        this.chatbotKnowledgeService = chatbotKnowledgeService;
    }

    // 1. GET: Lấy toàn bộ kiến thức chatbot
    // GET /api/chatbot-knowledge
    @GetMapping
    public ResponseEntity<List<ChatbotKnowledge>> getAllKnowledge() {

        return ResponseEntity.ok(
                chatbotKnowledgeService.getAllKnowledge()
        );
    }

    // 2. GET: Lấy kiến thức theo ID
    // GET /api/chatbot-knowledge/1
    @GetMapping("/{id}")
    public ResponseEntity<ChatbotKnowledge> getKnowledgeById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                chatbotKnowledgeService.getKnowledgeById(id)
        );
    }

    // 3. GET: Tìm kiếm kiến thức
    // GET /api/chatbot-knowledge/search?question=đặc sản
    @GetMapping("/search")
    public ResponseEntity<List<ChatbotKnowledge>> searchKnowledge(
            @RequestParam(required = false) String question,
            @RequestParam(required = false) String category
    ) {

        return ResponseEntity.ok(
                chatbotKnowledgeService.searchKnowledge(
                        question,
                        category
                )
        );
    }

    // 4. POST: Thêm kiến thức mới
    // POST /api/chatbot-knowledge
    @PostMapping
    public ResponseEntity<ChatbotKnowledge> createKnowledge(
            @RequestBody ChatbotKnowledge knowledge
    ) {

        ChatbotKnowledge result =
                chatbotKnowledgeService.createKnowledge(knowledge);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(result);
    }

    // 5. PUT: Cập nhật kiến thức
    // PUT /api/chatbot-knowledge/1
    @PutMapping("/{id}")
    public ResponseEntity<ChatbotKnowledge> updateKnowledge(
            @PathVariable Long id,
            @RequestBody ChatbotKnowledge knowledge
    ) {

        return ResponseEntity.ok(
                chatbotKnowledgeService.updateKnowledge(id, knowledge)
        );
    }

    // 6. DELETE: Xóa kiến thức
    // DELETE /api/chatbot-knowledge/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKnowledge(
            @PathVariable Long id
    ) {

        chatbotKnowledgeService.deleteKnowledge(id);

        return ResponseEntity.noContent().build();
    }
}
