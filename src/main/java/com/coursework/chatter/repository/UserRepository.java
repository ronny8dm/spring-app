package com.coursework.chatter.repository;


import com.coursework.chatter.entity.User;
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
public interface UserRepository extends JpaRepository<User, Long> {

//    optional code added to use on top of the basic CRUD operations
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String email);
    List<User> findByIsActive(Boolean isActive);
}
