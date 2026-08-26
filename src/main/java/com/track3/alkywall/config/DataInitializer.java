package com.track3.alkywall.config;

import com.track3.alkywall.models.Role;
import com.track3.alkywall.models.Category;
import com.track3.alkywall.repositories.RoleRepository;
import com.track3.alkywall.repositories.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initRolesAndCategories(RoleRepository roleRepository, CategoryRepository categoryRepository) {
        return args -> {
            if (roleRepository.findByName("USER").isEmpty()) {
                Role userRole = new Role();
                userRole.setName("USER");
                roleRepository.save(userRole);
            }
            if (roleRepository.findByName("ADMIN").isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName("ADMIN");
                roleRepository.save(adminRole);
            }
            
            if (categoryRepository.count() == 0) {
                Category c1 = new Category(); c1.setName("INGRESO");
                Category c2 = new Category(); c2.setName("COMIDA");
                Category c3 = new Category(); c3.setName("SERVICIOS");
                Category c4 = new Category(); c4.setName("ENTRETENIMIENTO");
                categoryRepository.save(c1);
                categoryRepository.save(c2);
                categoryRepository.save(c3);
                categoryRepository.save(c4);
            }
        };
    }
}
