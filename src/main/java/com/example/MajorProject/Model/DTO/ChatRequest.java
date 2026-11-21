package com.example.MajorProject.Model.DTO;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class ChatRequest {

    private String message;

    public String getMessage() {
        return message;
    }
}
