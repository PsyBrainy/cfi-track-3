package com.track3.alkywall.controllers;

import com.track3.alkywall.config.DataApiResponse;
import com.track3.alkywall.controllers.models.NewUserRequest;
import com.track3.alkywall.services.AuthService;
import com.track3.alkywall.services.JwtService;
import com.track3.alkywall.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final JwtService jwtService;
    private final AuthService authService;

    public AuthController(JwtService jwtService, AuthService authService){
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<DataApiResponse<Map<String, String>>> createUser(@RequestBody @Valid NewUserRequest newUser){
        authService.registerUser(
                newUser.firstName(),
                newUser.lastName(),
                newUser.email(),
                newUser.password(),
                newUser.dni()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(createTokenResponse(newUser.email()));
    }

    @PostMapping("/login")
    public ResponseEntity<String> token(){
        return ResponseEntity.ok(jwtService.createToken("email@gmail.com"));
    }

    private DataApiResponse<Map<String, String>> createTokenResponse(String email){
        return new DataApiResponse<>(
                true,
                "Usuario creado",
                Map.of("token", jwtService.createToken(email))
        );
    }
}