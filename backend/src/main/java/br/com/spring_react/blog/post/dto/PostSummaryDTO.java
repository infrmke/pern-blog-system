package br.com.spring_react.blog.post.dto;

import java.util.UUID;

public record PostSummaryDTO(UUID id, String title, String slug){
}
