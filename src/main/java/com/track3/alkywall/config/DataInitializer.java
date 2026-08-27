package com.track3.alkywall.config;

import com.track3.alkywall.models.Role;
import com.track3.alkywall.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initRolesAndCategories(RoleRepository roleRepository) {
        return args -> {
            if(roleRepository.count() == 0){
                roleRepository.save(new Role("ADMIN"));
                roleRepository.save(new Role("USER"));
            }
        };
    }
}