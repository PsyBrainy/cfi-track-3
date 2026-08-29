package com.track3.alkywall.repositories;

import com.track3.alkywall.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    boolean existsByDni(String dni);

    boolean existsByEmailOrDni(String email, String dni);

    @Query("select u.password from User u where u.email = ?1")
    Optional<String> findPasswordByEmail(String email);

    @Modifying
    @Query("update User u set u.isActive = ?2 where u.id = ?1")
    void updateIsActiveById(Long id, boolean active);
}
