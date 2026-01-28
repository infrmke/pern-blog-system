package br.com.spring_react.blog.user;

import br.com.spring_react.blog.user.internal.User;
import br.com.spring_react.blog.user.internal.UserRepository;
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
            return ResponseEntity.ok("There are no registered users.");
        }

        List<UserDTO> dtos = users.stream()
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getAvatar(), user.getSlug(), user.getRole()))
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}") // GET /users/id
    public UserDTO getUserById(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getAvatar(), user.getSlug(), user.getRole()))
                .orElseThrow(() -> new RuntimeException("User not found."));
    }

    @GetMapping("/profile/{slug}") // GET /users/profile/slug
    public UserDTO getUserBySlug(@PathVariable String slug) {
        return userRepository.findBySlug(slug)
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getAvatar(), user.getSlug(), user.getRole()))
                .orElseThrow(() -> new RuntimeException("User not found."));
    }

    @PostMapping // POST /users
    public UserDTO createUser(@RequestBody User user) {
        // verifica se o usuário já existe
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("E-mail already exists.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        return new UserDTO(
                savedUser.getId(), savedUser.getName(), savedUser.getEmail(),
                savedUser.getAvatar(), savedUser.getSlug(), savedUser.getRole());
    }

    @PatchMapping("/{id}") // PATCH /users/id
    public ResponseEntity<Object> updateUser(@PathVariable UUID id, @RequestBody UserUpdateDTO updateData) {
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
                    throw new RuntimeException("This e-mail already exists.");
                }

                user.setEmail(updateData.email());
            }

            // só atualiza se o "password" não for nulo
            if (updateData.password() != null) {
                user.setPassword(passwordEncoder.encode(updateData.password()));
            }

            userRepository.save(user);

            return ResponseEntity.ok((Object) new UserDTO(
                    user.getId(), user.getName(), user.getEmail(),
                    user.getAvatar(), user.getSlug(), user.getRole()));

        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found."));
    }

    @DeleteMapping("/{id}") // DELETE /users/id
    public ResponseEntity<Object> deleteUser(@PathVariable UUID id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
