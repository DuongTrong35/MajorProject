package com.example.MajorProject.Repository;
import com.example.MajorProject.Model.ChatbotKnowledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatbotKnowledgeRepository
        extends JpaRepository<ChatbotKnowledge, Long> {

    // Tìm theo danh mục
    List<ChatbotKnowledge> findByCategoryIgnoreCaseAndIsActiveTrue(
            String category
    );

    // Lấy tất cả kiến thức đang hoạt động
    List<ChatbotKnowledge> findByIsActiveTrue();

    // Tìm câu hỏi có chứa nội dung
    List<ChatbotKnowledge> findByQuestionContainingIgnoreCaseAndIsActiveTrue(
            String question
    );
}

