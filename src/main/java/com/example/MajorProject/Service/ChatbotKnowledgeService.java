package com.example.MajorProject.Service;


import com.example.MajorProject.Model.ChatbotKnowledge;
import com.example.MajorProject.Repository.ChatbotKnowledgeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class ChatbotKnowledgeService {

    private final ChatbotKnowledgeRepository chatbotKnowledgeRepository;

    public ChatbotKnowledgeService(
            ChatbotKnowledgeRepository chatbotKnowledgeRepository
    ) {
        this.chatbotKnowledgeRepository = chatbotKnowledgeRepository;
    }

    // 1. Lấy tất cả kiến thức đang hoạt động
    public List<ChatbotKnowledge> getAllKnowledge() {
        return chatbotKnowledgeRepository.findByIsActiveTrue();
    }

    // 2. Lấy kiến thức theo ID
    public ChatbotKnowledge getKnowledgeById(Long id) {

        return chatbotKnowledgeRepository.findById(id)
                .filter(item -> Boolean.TRUE.equals(item.getActive()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy kiến thức chatbot!"
                ));
    }

    // 3. Tìm kiếm kiến thức theo câu hỏi và danh mục
    public List<ChatbotKnowledge> searchKnowledge(
            String question,
            String category
    ) {

        List<ChatbotKnowledge> results;

        if (category != null && !category.isBlank()) {
            results = chatbotKnowledgeRepository
                    .findByCategoryIgnoreCaseAndIsActiveTrue(category);
        } else {
            results = chatbotKnowledgeRepository.findByIsActiveTrue();
        }

        if (question != null && !question.isBlank()) {
            String keyword = question.trim().toLowerCase();

            results = results.stream()
                    .filter(item ->
                            (item.getQuestion() != null &&
                                    item.getQuestion().toLowerCase().contains(keyword))
                                    ||
                                    (item.getKeywords() != null &&
                                            item.getKeywords().toLowerCase().contains(keyword))
                    )
                    .toList();
        }

        return results;
    }

    // 4. Thêm kiến thức mới
    @Transactional
    public ChatbotKnowledge createKnowledge(
            ChatbotKnowledge knowledge
    ) {

        knowledge.setId(null);
        knowledge.setActive(true);
        return chatbotKnowledgeRepository.save(knowledge);
    }

    // 5. Cập nhật kiến thức
    @Transactional
    public ChatbotKnowledge updateKnowledge(
            Long id,
            ChatbotKnowledge newData
    ) {

        ChatbotKnowledge oldData = getKnowledgeById(id);

        oldData.setQuestion(newData.getQuestion());
        oldData.setKeywords(newData.getKeywords());
        oldData.setAnswer(newData.getAnswer());
        oldData.setCategory(newData.getCategory());

        if (newData.getActive() != null) {
            oldData.setActive(newData.getActive());
        }

        return chatbotKnowledgeRepository.save(oldData);
    }

    // 6. Xóa kiến thức (xóa mềm)
    @Transactional
    public void deleteKnowledge(Long id) {

        ChatbotKnowledge knowledge = getKnowledgeById(id);

        knowledge.setActive(false);
        chatbotKnowledgeRepository.save(knowledge);
    }
}
