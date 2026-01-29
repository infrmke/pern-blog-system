package br.com.spring_react.blog.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserCreateDTO(
        @NotBlank(message = "Name cannot be empty")
        @Size(min = 2, max = 80, message = "Name must be between 2 or 80 characters")
        String name,

        @NotBlank(message = "Email cannot be empty")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password cannot be empty")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @NotBlank(message = "Confirm password is required")
        String confirmPassword) {
}
