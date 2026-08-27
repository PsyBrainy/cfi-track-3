package com.track3.alkywall.config;

import com.track3.alkywall.models.Role;
import com.track3.alkywall.models.User;
import com.track3.alkywall.repositories.RoleRepository;
import com.track3.alkywall.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initRolesAndCategories(RoleRepository roleRepository, UserRepository userRepository) {
        return args -> {
            if(roleRepository.count() == 0){
                roleRepository.save(new Role("ADMIN"));
                roleRepository.save(new Role("USER"));
            }

            if(userRepository.count() == 0){
                userRepository.save(new User(
                        "nombre",
                        "apellido",
                        "email@gmail.com",
                        "password",
                        "1",
                        roleRepository.findByName("USER")
                ));
            }
        };
    }
}