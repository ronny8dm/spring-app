package com.coursework.chatter.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;


// TODO: 11/10/2023 THIS IS AN EXAMPLE FOR USER ENTITY

/*
This communicates with the database and is used to store user information.
This talking with the DTO and the Service layer.

Separation of Concerns:

Entity: Represents the data structure as it is in the database and is used to interact with it.
DTO: Represents how the data is communicated between the API and the outside world (e.g., frontend, other APIs).
Data Encapsulation:

Entity: Might contain sensitive or internal data that should not be exposed outside.
DTO: Ensures that only the necessary data is exposed to the user or client applications.
Flexibility:

Entity: Changes in the entity might require database migrations and can be costly.
DTO: Can be changed without affecting the database layer, providing flexibility in what data is transferred.
 */



@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String password; // hashed password
    private Boolean isActive;
    private LocalDateTime createdAt;


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
    // getters and setters

