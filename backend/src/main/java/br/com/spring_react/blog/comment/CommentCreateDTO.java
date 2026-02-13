package br.com.spring_react.blog.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentCreateDTO(
        @NotBlank(message = "Comment cannot be empty")
        @Size(min = 1, max = 150, message = "Comment must be between 1 and 150 characters")
        String content
) {
}
