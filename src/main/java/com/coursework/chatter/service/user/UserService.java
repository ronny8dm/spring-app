package com.coursework.chatter.service.user;
import com.coursework.chatter.entity.User;
import org.hibernate.service.spi.ServiceException;

import java.util.List;
import java.util.Optional;


/*
Declares methods that will be used in the controller layer.
These methods define the operations that your application will support at the service layer related to user management.
 */

public interface UserService {

    public List<User> getUsers() throws ServiceException;

    public Optional<User> findByUsername(String username) throws ServiceException;

    public void registerUser(User userForm) throws ServiceException;

    public void saveUser(User user) throws ServiceException;

    public void updateUser(User user) throws ServiceException;

    public void deleteUser(User user) throws ServiceException;

}
