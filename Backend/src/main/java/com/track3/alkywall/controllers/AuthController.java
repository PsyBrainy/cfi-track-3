package com.track3.alkywall.controllers;

import com.track3.alkywall.services.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/auth")
public class AuthController {
    private final JwtService jwtService;

    public AuthController(JwtService jwtService){
        this.jwtService = jwtService;
    }

    @GetMapping("/admin")
    public ResponseEntity<String> admin(){
        return ResponseEntity.ok("admin");
    }

    @PostMapping("/login")
    public ResponseEntity<String> token(){
        return ResponseEntity.ok(jwtService.createToken("email@gmail.com"));
    }

    @GetMapping("/user")
    public ResponseEntity<String> authUser(){
        return ResponseEntity.ok("user");
    }
}