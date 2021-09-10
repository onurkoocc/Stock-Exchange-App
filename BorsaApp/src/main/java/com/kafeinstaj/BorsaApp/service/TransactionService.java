package com.kafeinstaj.BorsaApp.service;

import com.kafeinstaj.BorsaApp.model.ERole;
import com.kafeinstaj.BorsaApp.model.Role;
import com.kafeinstaj.BorsaApp.model.Transaction;
import com.kafeinstaj.BorsaApp.model.User;
import com.kafeinstaj.BorsaApp.payload.response.MessageResponse;
import com.kafeinstaj.BorsaApp.repository.StockRepository;
import com.kafeinstaj.BorsaApp.repository.TransactionRepository;
import com.kafeinstaj.BorsaApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
@Service
@Transactional
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StockRepository stockRepository;
    public List<Transaction> listAllTransactions () {return transactionRepository.findAll();}

    public void saveTransaction(Transaction transaction){
        transactionRepository.save(transaction);

    }

    public Transaction getTransaction(Integer id){
        return transactionRepository.findById(id).get();
    }

    public Boolean existById(Integer id){
        return transactionRepository.existsById(id);
    }
    public Boolean deleteTransaction(Integer transactionId){
        if(transactionRepository.existsById(transactionId)) {
            Transaction transaction = transactionRepository.getById(transactionId);
            transactionRepository.deleteById(transactionId);
            return true;
        }
        return false;

    }

    public List<Transaction> getPortfolio(Integer userId){
        List<Transaction> portfolio = new ArrayList<Transaction>();
        for(Transaction transaction : transactionRepository.findAll()){
            if(transaction.getUser().getId() == userId){
                portfolio.add(transaction);
            }}
        return portfolio;
    }
}
