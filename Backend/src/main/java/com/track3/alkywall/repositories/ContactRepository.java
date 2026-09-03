package com.track3.alkywall.repositories;

import com.track3.alkywall.models.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByUserEmail(String userEmail);

    boolean existsByUserEmailAndContactUserId(String userEmail, Long contactUserId);

    Optional<Contact> findByIdAndUserEmail(Long id, String userEmail);
}