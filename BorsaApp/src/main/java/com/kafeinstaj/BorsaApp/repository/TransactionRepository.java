package com.kafeinstaj.BorsaApp.repository;

import com.kafeinstaj.BorsaApp.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    @Override
    boolean existsById(Integer integer);
}
