package com.coursework.chatter.service.user;
import com.coursework.chatter.dto.UserDto;

import java.util.List;


/*
Declares methods that will be used in the controller layer.
These methods define the operations that your application will support at the service layer related to user management.
 */

public interface UserService {
    UserDto findByUsername(String username);
    UserDto createUser(UserDto userDto);
    UserDto updateUser(Long userId, UserDto userDto);
    void deleteUser(Long userId);
    List<UserDto> findAllUsers();
}
