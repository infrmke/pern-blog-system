package br.com.spring_react.blog.comment.internal;

import br.com.spring_react.blog.comment.dto.CommentDetailsDTO;
import br.com.spring_react.blog.post.dto.PostSummaryDTO;
import br.com.spring_react.blog.user.dto.UserSummaryDTO;

public class CommentMapper {

    public static CommentDetailsDTO toDetailsDTO(Comment comment) {
        if (comment == null) return null;

        var author = comment.getAuthor();
        var post = comment.getPost();

        UserSummaryDTO authorDTO = new UserSummaryDTO(
                author.getId(),
                author.getName(),
                author.getSlug()
        );

        PostSummaryDTO postDTO = new PostSummaryDTO(
                post.getId(),
                post.getTitle(),
                post.getSlug()
        );

        return new CommentDetailsDTO(
                comment.getId(),
                comment.getContent(),
                authorDTO,
                postDTO,
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}
