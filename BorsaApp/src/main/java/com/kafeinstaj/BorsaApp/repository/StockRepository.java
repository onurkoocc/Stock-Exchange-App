package com.kafeinstaj.BorsaApp.repository;

import com.kafeinstaj.BorsaApp.model.ERole;
import com.kafeinstaj.BorsaApp.model.Role;
import com.kafeinstaj.BorsaApp.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Integer> {
    Optional<Stock> findByName(String name);
    Optional<Stock> findByCode(String code);

    @Override
    boolean existsById(Integer integer);
}
