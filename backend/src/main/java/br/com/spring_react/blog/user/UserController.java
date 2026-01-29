package br.com.spring_react.blog.user;

import br.com.spring_react.blog.user.internal.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping // GET /users
    public ResponseEntity<Object> getAllUsers() {
        List<User> users = userService.findAllUsers();

        if (users.isEmpty()) {
            return ResponseEntity.ok(new MessageResponse("There are no registered users."));
        }

        List<UserDTO> dtos = users.stream()
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail(),
                        user.getAvatar(), user.getSlug(), user.getRole()))
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}") // GET /users/id
    public ResponseEntity<Object> getUserById(@PathVariable UUID id) {
        try {
            User user = userService.findById(id);

            return ResponseEntity.ok(new UserDTO(user.getId(), user.getName(), user.getEmail(),
                    user.getAvatar(), user.getSlug(), user.getRole()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/profile/{slug}") // GET /users/profile/slug
    public ResponseEntity<Object> getUserBySlug(@PathVariable String slug) {
        try {
            User user = userService.findBySlug(slug);

            return ResponseEntity.ok(new UserDTO(user.getId(), user.getName(), user.getEmail(),
                    user.getAvatar(), user.getSlug(), user.getRole()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping // POST /users
    public ResponseEntity<Object> createUser(@Valid @RequestBody UserCreateDTO user) {
        try {
            User savedUser = userService.createUser(user);

            return ResponseEntity.status(HttpStatus.CREATED).body(new UserDTO(
                    savedUser.getId(), savedUser.getName(), savedUser.getEmail(),
                    savedUser.getAvatar(), savedUser.getSlug(), savedUser.getRole()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(e.getMessage()));
        }
    }

    @PatchMapping("/{id}") // PATCH /users/id
    public ResponseEntity<Object> updateUser(@PathVariable UUID id,
                                             @Valid @RequestBody UserUpdateDTO updateData) {
        try {
            User updatedUser = userService.updateUser(id, updateData);

            return ResponseEntity.ok((Object) new UserDTO(
                    updatedUser.getId(), updatedUser.getName(), updatedUser.getEmail(),
                    updatedUser.getAvatar(), updatedUser.getSlug(), updatedUser.getRole()));
        } catch (RuntimeException e) {
            HttpStatus status = e.getMessage().contains("not found") ? HttpStatus.NOT_FOUND :
                    HttpStatus.BAD_REQUEST;

            return ResponseEntity.status(status).body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}") // DELETE /users/id
    public ResponseEntity<Object> deleteUser(@PathVariable UUID id) {
        try {
            userService.deleteUser(id);

            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        }
    }
}
