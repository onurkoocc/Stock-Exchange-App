package com.kafeinstaj.BorsaApp.repository;

import com.kafeinstaj.BorsaApp.model.ERole;
import com.kafeinstaj.BorsaApp.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Integer> {
    Optional<Role> findByName(ERole name);
}
