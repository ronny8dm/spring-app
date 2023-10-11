//package com.coursework.chatter.service.user;
//
//import com.coursework.chatter.dto.UserDto;
//import com.coursework.chatter.entity.User;
//import com.coursework.chatter.exception.UserAlreadyExistsException;
//import com.coursework.chatter.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class UserServiceImpl implements UserService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private BCryptPasswordEncoder bCryptPasswordEncoder;
//
//
//
//    @Override
//    public UserDto findByUsername(String username) {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        return convertToDto(user);
//    }
//
//    @Override
//    public UserDto createUser(UserDto userDto) {
//        // Check if username or email already exists
//        userRepository.findByUsernameOrEmail(userDto.getUsername(), userDto.getEmail())
//                .ifPresent(existingUser -> {
//                    throw new UserAlreadyExistsException("User with this username or email already exists");
//                });
//
//        User user = new User();
//        // Set user properties from userDto
//        // Hash and salt the password
//        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
//
//        userRepository.save(user);
//        return convertToDto(user);
//    }
//
//    @Override
//    public UserDto updateUser(Long userId, UserDto userDto) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        // Update user properties from userDto
//        userRepository.save(user);
//        return convertToDto(user);
//    }
//
//    @Override
//    public void deleteUser(Long userId) {
//        userRepository.deleteById(userId);
//    }
//
//    @Override
//    public List<UserDto> findAllUsers() {
//        List<User> users = userRepository.findAll();
//        return users.stream()
//                .map(this::convertToDto)
//                .collect(Collectors.toList());
//    }
//
//    private UserDto convertToDto(User user) {
//        UserDto userDto = new UserDto();
//        // Set userDto properties from user
//        return userDto;
//    }
//}
