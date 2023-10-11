package com.coursework.chatter.dto;



/*
    * This class is used to transfer user data to the client.
    * You might not want to expose the password field in the api response
    * You also might want to include additional fields that are not in the User entity.
    *
    * Entity: Represents the data structure as it is in the database and is used to interact with it.
    * DTO: Represents the data structure as it is exposed by the API and is used to transfer data,
    * between the API layer and the service layer.
 */

public class UserDto {


    private String username;
    private String email;
    private String password; // hashed password
    private String formattedName; // computed or formatted field

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

    public String getFormattedName() {
        return formattedName;
    }

    public void setFormattedName(String formattedName) {
        this.formattedName = formattedName;
    }

    public String getPassword() {
        return password;
    }

    // getters and setters
}
