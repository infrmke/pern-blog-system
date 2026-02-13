package br.com.spring_react.blog.comment;

import br.com.spring_react.blog.post.PostSummaryDTO;
import br.com.spring_react.blog.user.UserSummaryDTO;

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
