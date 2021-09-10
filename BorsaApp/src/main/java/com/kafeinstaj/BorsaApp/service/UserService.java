package com.kafeinstaj.BorsaApp.service;

import com.kafeinstaj.BorsaApp.model.User;
import com.kafeinstaj.BorsaApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public List<User> listAllUser() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User getUser(Integer id) {
        return userRepository.findById(id).get();
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    public Optional<User> getUserByName(String username) {
        return userRepository.findByUsername(username);
    }
    public Boolean existsUserByName(String username) {
        return userRepository.existsByUsername(username);
    }

    public Boolean existsUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Boolean existsById(Integer id){
        return userRepository.existsById(id);
    }
}
