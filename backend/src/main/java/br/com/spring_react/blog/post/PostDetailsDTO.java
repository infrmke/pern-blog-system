package br.com.spring_react.blog.post;

import br.com.spring_react.blog.user.UserSummaryDTO;

import java.time.LocalDateTime;
import java.util.UUID;

public record PostDetailsDTO(
        UUID id,
        String title,
        String summary,
        String content,
        String banner,
        String slug,
        UserSummaryDTO author,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
