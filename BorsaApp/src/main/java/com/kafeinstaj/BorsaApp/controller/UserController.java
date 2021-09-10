package com.kafeinstaj.BorsaApp.controller;

import com.kafeinstaj.BorsaApp.model.*;
import com.kafeinstaj.BorsaApp.payload.request.transactionRequest;
import com.kafeinstaj.BorsaApp.repository.RoleRepository;
import com.kafeinstaj.BorsaApp.service.StockService;
import com.kafeinstaj.BorsaApp.service.TransactionService;
import org.springframework.security.access.prepost.PreAuthorize;
import com.kafeinstaj.BorsaApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/user")
@PreAuthorize("hasRole('USER')")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    TransactionService transactionService;

    @Autowired
    StockService stockService;

    @Autowired
    RoleRepository roleRepository;




    @GetMapping("/stocks")
    public List<Stock> list() {
        return stockService.listAllStocks();
    }

    @PostMapping("/portfolio")
    public List<Transaction> list(@RequestBody transactionRequest request) {
        if(userService.existsById(request.getUserId())) {
            return transactionService.getPortfolio(request.getUserId());
        }

        return new ArrayList<>();
    }

    @PostMapping("/buyStock")
    public void buyStock(@RequestBody transactionRequest request){
        Boolean isFound = false;
        if(userService.existsById(request.getUserId())) {
            List<Transaction> transactions = transactionService.getPortfolio(request.getUserId());
            for(Transaction transaction : transactions) {
                if (transaction.getStock().getCode().equals(request.getCode())) {
                    System.out.println("iÃ§erdeyizz");
                    transaction.setPrice(transaction.getPrice() + request.getPrice()*request.getStockCount());
                    transaction.setCount(transaction.getCount() + request.getStockCount());
                    transaction.setDate(request.getDate());
                    transactionService.saveTransaction(transaction);
                    isFound = true;
                }
            }
            if(!isFound){
                Transaction transaction = new Transaction(
                        userService.getUser(request.getUserId()),
                        stockService.getByCode(request.getCode()),
                        request.getPrice()*request.getStockCount(),
                        request.getDate(),
                        request.getStockCount()
                );
                transactionService.saveTransaction(transaction);
            }

        }
    }


    @PostMapping("/sellStock")
    public void sellStock(@RequestBody transactionRequest request){
        Boolean isFound = false;
        if(userService.existsById(request.getUserId())) {
            List<Transaction> transactions = transactionService.getPortfolio(request.getUserId());
            for (Transaction transaction : transactions) {
                if (transaction.getStock().getCode().equals(request.getCode())) {
                    transaction.setPrice(transaction.getPrice() - request.getPrice()*request.getStockCount());
                    transaction.setCount(transaction.getCount() - request.getStockCount());
                    transaction.setDate(request.getDate());
                    transactionService.saveTransaction(transaction);
                    if (transactionService.getTransaction(transaction.getId()).getPrice() < 0 || transactionService.getTransaction(transaction.getId()).getCount() < 0) {
                        transactionService.deleteTransaction(transaction.getId());
                    }
                }
            }
        }}}