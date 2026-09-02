package com.track3.alkywall.controllers;

import com.track3.alkywall.config.ApiResponse;
import com.track3.alkywall.config.DataApiResponse;
import com.track3.alkywall.controllers.models.UserResponse;
import com.track3.alkywall.controllers.models.UserUpdateRequest;
import com.track3.alkywall.services.UserService;
import com.track3.alkywall.services.models.DomainUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<DataApiResponse<List<UserResponse>>> getAllUsers(){
        List<DomainUser> users = userService.getAllUsers();

        return ResponseEntity.ok(new DataApiResponse<>(
                true,
                null,
                users.stream().map(UserResponse::from).toList()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DataApiResponse<UserResponse>> getUserById(@PathVariable Long id){
        DomainUser user = userService.getUserById(id);

        return ResponseEntity.ok(new DataApiResponse<>(
                true,
                null,
                UserResponse.from(user)
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateUser(
            @PathVariable Long id,
            @RequestBody @Valid UserUpdateRequest user
    ){
        userService.update(UserUpdateRequest.toDomainUser(user, id));

        return ResponseEntity.ok(new ApiResponse(
                true,
                "Usuario actualizado"
        ));
    }

    @PostMapping("/block/{id}")
    public ResponseEntity<Void> toggleBlockUser(@PathVariable Long id){
        userService.toggleIsActive(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
