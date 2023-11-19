package com.coursework.chatter.service.user;

import com.coursework.chatter.entity.Role;
import com.coursework.chatter.entity.User;
import com.coursework.chatter.repository.UserRepository;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public List<User> getUsers() throws ServiceException {
        try {
            return userRepository.findAll();
        } catch (Exception e) {
            throw new ServiceException("Error retrieving users.", e);
        }
    }

    @Override
    public Optional<User> findByUsername(String username) throws ServiceException {
        try {
            return userRepository.findByUsername(username);
        } catch (Exception e) {
            throw new ServiceException("Error while fetching user by username", e);
        }
    }

    @Override
    public void registerUser(User userForm) throws ServiceException {
        try {
            userForm.setEnabled(true);
            userForm.setPassword(passwordEncoder.encode(userForm.getPassword()));
            saveUser(userForm);

            Role role = new Role("admin", userForm);
            userForm.getRole().add(role);
            updateUser(userForm);
        } catch (Exception e) {
            throw new ServiceException("Error while registering user", e);
        }
    }

    @Override
    public void saveUser(User user) throws ServiceException {
        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new ServiceException("Error saving user.", e);
        }
    }

    @Override
    public void updateUser(User user) throws ServiceException {
        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new ServiceException("Error while updating user", e);
        }
    }

    @Override
    public void deleteUser(User user) throws ServiceException {
        try {
            userRepository.delete(user);
        } catch (Exception e) {
            throw new ServiceException("Error deleting user.", e);
        }
    }
}