package br.com.spring_react.blog.session.dto;

import br.com.spring_react.blog.user.internal.User;

public record LoginResponse(String token, User user) {
}
