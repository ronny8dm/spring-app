package com.coursework.chatter.controller;

import java.util.logging.Level;
import java.util.logging.Logger;
import com.coursework.chatter.entity.User;
import com.coursework.chatter.service.user.UserService;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class SignupController {

    private Logger logger = Logger.getLogger(getClass().getName());

    @Autowired
    private UserService userService;

    @RequestMapping(value = { "/signup" }, method = RequestMethod.GET)
    public ModelAndView showSignupForm() {
        logger.info("[CONTROLLER] Showing sign-up form");

        ModelAndView model = new ModelAndView();
        model.setViewName("sign-up");
        model.addObject("user", new User());
        return model;
    }

    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    public ModelAndView processSignupForm(@ModelAttribute("user") User user, BindingResult bindingResult) {
        logger.info("[CONTROLLER] Processing sign-up form");

        ModelAndView model = new ModelAndView();

        if (userService.findByUsername(user.getUsername()).isPresent()) {
            bindingResult.rejectValue("username", "error.username", "Username already exists");
        }

        if (!user.getPassword().equals(user.getConfirmPassword())) {
            bindingResult.rejectValue("confirmPassword", "error.confirmPassword", "Passwords do not match");
        }

        if (bindingResult.hasErrors()) {
            logger.warning("[CONTROLLER] Sign-up form validation failed");
            model.setViewName("sign-up");
            return model;
        }

        try {
            userService.registerUser(user);
            logger.info("[CONTROLLER] Registered user successfully: " + user.getUsername());
            model.addObject("success", "Registration successful! You can now log in.");
        } catch (ServiceException e) {
            logger.log(Level.SEVERE, "[CONTROLLER] Error while registering user: " + user.getUsername(), e);
            model.addObject("error", "An error occurred during registration. Please try again.");
        }

        model.setViewName("sign-up");
        return model;
    }

}
