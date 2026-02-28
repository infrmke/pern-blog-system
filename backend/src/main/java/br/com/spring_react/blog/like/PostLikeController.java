package br.com.spring_react.blog.like;

import br.com.spring_react.blog.like.internal.PostLikeService;
import br.com.spring_react.blog.user.MessageResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/likes")
public class PostLikeController {

    private final PostLikeService postLikeService;

    public PostLikeController(PostLikeService postLikeService) {
        this.postLikeService = postLikeService;
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity<Object> toggleLike(@PathVariable UUID postId,
                                             HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId"); // recuperando o id anexado

        boolean isLiked = postLikeService.toggleLike(postId, UUID.fromString(userId));

        if (isLiked) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new MessageResponse("Post liked."));
        }

        return ResponseEntity.ok(new MessageResponse("Post disliked."));
    }
}
