package com.track3.alkywall.services;

import com.track3.alkywall.config.exceptions.LoginFailedException;
import com.track3.alkywall.config.exceptions.NotFoundException;
import com.track3.alkywall.config.exceptions.AlreadyExistsException;
import com.track3.alkywall.models.User;
import com.track3.alkywall.repositories.RoleRepository;
import com.track3.alkywall.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final AccountService accountService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository, AccountService accountService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.accountService = accountService;
    }

    @Transactional
    public void registerUser(String firstName, String lastName, String email, String password, String dni){
        if(userRepository.existsByEmailOrDni(email, dni)) throw new AlreadyExistsException("El usuario ya existe");

        User user = userRepository.save(new User(
                firstName,
                lastName,
                email,
                passwordEncoder.encode(password),
                dni,
                roleRepository.findByName("USER").orElseThrow(() -> new NotFoundException("El rol no existe"))
        ));

        accountService.createAccount(user, "ARS");
    }

    public void loginUser(String email, String loginPassword){
        Optional<String> password = userRepository.findPasswordByEmail(email);

        if(password.isEmpty() || !passwordEncoder.matches(loginPassword, password.get())){
            throw new LoginFailedException("Email o contraseña incorrectos");
        };
    }
}
