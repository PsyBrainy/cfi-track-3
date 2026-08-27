package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.UserAlreadyExistsException;
import com.track3.alkywall.models.User;
import com.track3.alkywall.repositories.RoleRepository;
import com.track3.alkywall.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @Transactional
    public void registerUser(String firstName, String lastName, String email, String password, String dni){
        if(userRepository.existsByEmailOrDni(email, dni)) throw new UserAlreadyExistsException();

        userRepository.save(new User(
                firstName,
                lastName,
                email,
                passwordEncoder.encode(password),
                dni,
                roleRepository.findByName("USER")
        ));
    }
}
