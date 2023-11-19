package com.coursework.chatter.repository;

import com.coursework.chatter.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


/**
 * JpaRepository is a generic interface that takes in two parameters:
 * 1. the entity class
 * 2. the type of the primary key
 * It provides the methods for CRUD operations behind the scenes without having to write any code
 * Thus, we can use the methods in this interface to perform CRUD operations on the database
 * 70% reduction in code
 * Minimise boilerplate code
 */
public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}

