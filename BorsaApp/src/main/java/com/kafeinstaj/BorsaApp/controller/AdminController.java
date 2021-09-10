package com.kafeinstaj.BorsaApp.controller;


import com.kafeinstaj.BorsaApp.model.ERole;
import com.kafeinstaj.BorsaApp.model.Role;
import com.kafeinstaj.BorsaApp.model.Stock;
import com.kafeinstaj.BorsaApp.model.User;
import com.kafeinstaj.BorsaApp.payload.request.stockInfoRequest;
import com.kafeinstaj.BorsaApp.payload.request.userInfoRequest;
import com.kafeinstaj.BorsaApp.payload.response.MessageResponse;
import com.kafeinstaj.BorsaApp.repository.RoleRepository;
import com.kafeinstaj.BorsaApp.service.StockService;
import com.kafeinstaj.BorsaApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URISyntaxException;
import java.util.List;
import java.util.NoSuchElementException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    UserService userService;
    @Autowired
    StockService stockService;

    @Autowired
    PasswordEncoder encoder;


    @Autowired
    RoleRepository roleRepository;

    @GetMapping("/users")
    public List<User> listAllUsers() { return userService.listAllUser(); }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Integer id) {
        try {
            User user = userService.getUser(id);
            return new ResponseEntity<User>(user, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Integer id) {

        userService.deleteUser(id);
    }


    @PostMapping("/users")
    public ResponseEntity createUser(@Valid @RequestBody userInfoRequest user) throws URISyntaxException {
        if (userService.existsUserByName(user.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userService.existsUserByEmail(user.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User userTmp = new User(user.getName(),
                user.getSurname(),
                user.getEmail(),
                user.getUsername(),
                encoder.encode(user.getPassword()));
        String strRole = user.getRole();
        Role role = new Role();

        if(strRole.equalsIgnoreCase("admin")){
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            role.setRole(adminRole);
        }else{

            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            role.setRole(userRole);
        }

        userTmp.setRole(role);
        userTmp = userService.saveUser(userTmp);

        return ResponseEntity.ok(userTmp);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity updateUser(@PathVariable Integer id,@Valid @RequestBody userInfoRequest user) {
        User userTmp = userService.getUser(id);
        userTmp.setName(user.getName());
        userTmp.setSurname(user.getSurname());
        userTmp.setUsername(user.getUsername());
        userTmp.setEmail(user.getEmail());

        String strRole = user.getRole();
        Role role = new Role();

        if(strRole.equalsIgnoreCase("admin")){
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            role.setRole(adminRole);
        }else{

            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            role.setRole(userRole);
        }

        userTmp.setRole(role);
        userTmp = userService.saveUser(userTmp);

        return ResponseEntity.ok(userTmp);
    }


    @GetMapping("/stocks")
    public List<Stock> list() {
        return stockService.listAllStocks();
    }

    @GetMapping("/stocks/{id}")
    public ResponseEntity<Stock> get(@PathVariable Integer id) {
        try {
            Stock stock = stockService.getStock(id);
            return new ResponseEntity<Stock>(stock, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<Stock>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/stocks")
    public void add(@Valid @RequestBody stockInfoRequest stock) {
        Stock stockTmp = new Stock();
        stockTmp.setName(stock.getName());
        stockTmp.setCode(stock.getCode());
        stockService.saveStock(stockTmp);
    }
    @PutMapping("/stocks/{id}")
    public ResponseEntity<?> update(@Valid @RequestBody stockInfoRequest stock, @PathVariable Integer id) {
        try {
            Stock stockTmp = stockService.getStock(id);
            stockTmp.setName(stock.getName());
            stockTmp.setCode(stock.getCode());
            stockService.saveStock(stockTmp);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/stocks/{id}")
    public void delete(@PathVariable Integer id) {

        stockService.deleteStock(id);
    }


}
