package br.com.spring_react.blog.user;

import br.com.spring_react.blog.user.internal.UserRole;

import java.util.UUID;

public record UserDTO(UUID id,
                      String name,
                      String email,
                      String avatar,
                      String slug,
                      UserRole role) {
}
