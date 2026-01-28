package br.com.spring_react.blog.user.internal;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.PROTECTED)
    private UUID id;

    @Column(nullable = false)
    @Size(min = 2, max = 54)
    private String name;

    @Column(unique = true, nullable = false)
    @Email
    private String email;

    @Column(nullable = false)
    private String password;

    private String avatar;

    @Column(unique = true, nullable = false)
    private String slug;

    @Enumerated(EnumType.STRING) // salva como "USER" ou "ADMIN" no banco
    @Column(nullable = false)
    private UserRole role;

    @Column(name = "created_at", updatable = false)
    @Setter(AccessLevel.NONE)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @Setter(AccessLevel.NONE)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();

        // cria um slug único para o usuário (nome-completo-e-uuid)
        if (this.slug == null || this.slug.isEmpty()) {
            String baseSlug = name.toLowerCase().replaceAll("[^a-z0-9]", "-");
            String shortId = UUID.randomUUID().toString().split("-")[0];
            this.slug = baseSlug + "-" + shortId;
        }

        // atribui um avatar ao usuário a partir do seu primeiro nome
        if (this.avatar == null || this.avatar.isEmpty()) {
            String firstName = name.split(" ")[0];
            this.avatar = "https://ui-avatars.com/api/?name=" + firstName + "&background=random";
        }

        // atribui USER como role padrão caso o contrário não tenha sido especificado
        if (this.role == null) {
            this.role = UserRole.USER;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
