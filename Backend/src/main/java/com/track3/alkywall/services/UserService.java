package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.UserAlreadyExistsException;
import com.track3.alkywall.models.User;
import com.track3.alkywall.repositories.RoleRepository;
import com.track3.alkywall.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void createUser(String firstName, String lastName, String email, String password, String dni){
        if(userRepository.existsByEmailOrDni(email, dni)) throw new UserAlreadyExistsException();

        userRepository.save(new User(
                firstName,
                lastName,
                email,
                password,
                dni,
                roleRepository.findByName("USER")
        ));
    }
}
