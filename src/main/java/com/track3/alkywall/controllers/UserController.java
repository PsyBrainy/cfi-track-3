package com.track3.alkywall.controllers;

import com.track3.alkywall.dtos.UserRegisterDTO;
import com.track3.alkywall.dtos.UserResponseDTO;
import com.track3.alkywall.services.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/users") // Todas las rutas acá empezarán con /users
public class UserController {


    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    // Ruta: POST /users/register
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRegisterDTO dto) {
        UserResponseDTO response = userService.register(dto);
        return ResponseEntity.ok(response);
    }
}
