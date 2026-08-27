package com.track3.alkywall.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Table(name = "users")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 100)
    String firstName;

    @Column(nullable = false, length = 100)
    String lastName;

    @Column(nullable = false, length = 150, unique = true)
    String email;

    @Column(nullable = false)
    String password;

    @Column(nullable = false, unique = true, length = 20)
    String dni;

    @ManyToOne
    @JoinColumn(name = "rol_id")
    Role role;

    @Column(nullable = false)
    Boolean isActive;

    @Column(nullable = false)
    LocalDateTime createdAt;

    public User(String firstName, String lastName, String email, String password, String dni, Role role){
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.dni = dni;
        this.role = role;
        this.isActive = true;
        this.createdAt = LocalDateTime.now();
    }
}
