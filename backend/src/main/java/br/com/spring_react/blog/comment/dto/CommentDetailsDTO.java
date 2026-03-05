package br.com.spring_react.blog.comment.dto;

import br.com.spring_react.blog.post.dto.PostSummaryDTO;
import br.com.spring_react.blog.user.dto.UserSummaryDTO;

import java.time.LocalDateTime;
import java.util.UUID;

public record CommentDetailsDTO(
        UUID id,
        String content,
        UserSummaryDTO author,
        PostSummaryDTO post,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
