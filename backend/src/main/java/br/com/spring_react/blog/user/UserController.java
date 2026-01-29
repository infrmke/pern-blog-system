package br.com.spring_react.blog.user;

import br.com.spring_react.blog.user.internal.User;
import br.com.spring_react.blog.user.internal.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping // GET /users
    public ResponseEntity<Object> getAllUsers() {
        List<User> users = userRepository.findAll();

        if (users.isEmpty()) {
            return ResponseEntity.ok(new MessageResponse("There are no registered users."));
        }

        List<UserDTO> dtos = users.stream()
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getAvatar(), user.getSlug(), user.getRole()))
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}") // GET /users/id
    public ResponseEntity<Object> getUserById(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok((Object) new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getAvatar(), user.getSlug(), user.getRole())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found.")));
    }

    @GetMapping("/profile/{slug}") // GET /users/profile/slug
    public ResponseEntity<Object> getUserBySlug(@PathVariable String slug) {
        return userRepository.findBySlug(slug)
                .map(user -> ResponseEntity.ok((Object) new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getAvatar(), user.getSlug(), user.getRole())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found.")));
    }

    @PostMapping // POST /users
    public ResponseEntity<Object> createUser(@Valid @RequestBody UserCreateDTO user) {

        // verifica se o usuário já existe
        if (userRepository.findByEmail(user.email()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse("This e-mail already exists."));
        }

        // verifica se as senhas são iguais
        if (!user.password().equals(user.confirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Passwords must match each other."));
        }

        // atribuindo campos ao novo usuário
        User newUser = new User();
        newUser.setName(user.name());
        newUser.setEmail(user.email());
        newUser.setPassword(passwordEncoder.encode(user.password()));

        User savedUser = userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(new UserDTO(
                savedUser.getId(), savedUser.getName(), savedUser.getEmail(),
                savedUser.getAvatar(), savedUser.getSlug(), savedUser.getRole()));
    }

    @PatchMapping("/{id}") // PATCH /users/id
    public ResponseEntity<Object> updateUser(@PathVariable UUID id, @Valid @RequestBody UserUpdateDTO updateData) {
        return userRepository.findById(id).map(user -> {

            // só atualiza se o "name" não for nulo
            if (updateData.name() != null) {
                user.setName(updateData.name());
            }

            // só atualiza se o "email" não for nulo
            if (updateData.email() != null) {
                Optional<User> existingUser = userRepository.findByEmail(updateData.email());

                // verifica se o e-mail existe e não é o e-mail do próprio usuário que está tentando atualizar
                if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body((Object) new MessageResponse("This e-mail already exists."));
                }

                user.setEmail(updateData.email());
            }

            // só atualiza se o "password" não for nulo e corresponder com "confirmPassword"
            if (updateData.password() != null) {
                if (!updateData.password().equals(updateData.confirmPassword())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body((Object) new MessageResponse("Passwords must match each other."));
                }

                user.setPassword(passwordEncoder.encode(updateData.password()));
            }

            userRepository.save(user);

            return ResponseEntity.ok((Object) new UserDTO(
                    user.getId(), user.getName(), user.getEmail(),
                    user.getAvatar(), user.getSlug(), user.getRole()));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found.")));
    }

    @DeleteMapping("/{id}") // DELETE /users/id
    public ResponseEntity<Object> deleteUser(@PathVariable UUID id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found."));
        }

        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
