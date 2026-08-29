package com.track3.alkywall.config;

import com.track3.alkywall.config.exceptions.NotFoundException;
import com.track3.alkywall.models.Role;
import com.track3.alkywall.models.User;
import com.track3.alkywall.repositories.RoleRepository;
import com.track3.alkywall.repositories.UserRepository;
import com.track3.alkywall.services.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initRolesAndCategories(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if(roleRepository.count() == 0){
                roleRepository.save(new Role("ADMIN"));
                roleRepository.save(new Role("USER"));
            }

            // Creación de usuario admin
            if(userRepository.findByEmail("admin@alkywall.com").isEmpty()){
                userRepository.save(new User(
                        "admin",
                        "",
                        "admin@alkywall.com",
                        passwordEncoder.encode("adminpassword"),
                        "",
                        roleRepository.findByName("ADMIN").get()
                ));
            }
        };
    }
}