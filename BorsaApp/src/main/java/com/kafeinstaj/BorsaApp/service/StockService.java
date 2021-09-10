package com.kafeinstaj.BorsaApp.service;

import com.kafeinstaj.BorsaApp.model.Stock;
import com.kafeinstaj.BorsaApp.repository.StockRepository;
import org.junit.platform.commons.logging.Logger;
import org.junit.platform.commons.logging.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import yahoofinance.YahooFinance;
import yahoofinance.histquotes.HistoricalQuote;
import yahoofinance.histquotes.Interval;


import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Calendar;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static java.lang.Thread.sleep;

@Service
@Transactional

public class StockService {
    @Autowired
    private StockRepository stockRepository;
    public List<Stock> listAllStocks() {
        return stockRepository.findAll();
    }

    public void saveStock(Stock stock) {
        stockRepository.save(stock);
    }

    public Stock getStock(Integer id) {
        return stockRepository.findById(id).get();
    }

    public void deleteStock(Integer id) {
        stockRepository.deleteById(id);
    }

    public Stock getByCode(String code) {
        List<Stock>  liste = listAllStocks();
        Stock stockTmp = new Stock();
        for(Stock stock : liste){
            if(stock.getCode().equals(code)){
                stockTmp.setCode(code);
                stockTmp.setName(stock.getName());
                stockTmp.setId(stock.getId());
            }
        }
        return stockTmp;
    }


    public List<HistoricalQuote> getHistoricalData(String code){
        Calendar from = Calendar.getInstance();
        Calendar to = Calendar.getInstance();
        from.add(Calendar.YEAR, -1);
        yahoofinance.Stock stockInfo;
        List<HistoricalQuote> returnList = null;
        try {
            stockInfo = YahooFinance.get(code,from, to, Interval.DAILY);
            if(stockInfo!=null)
                returnList = stockInfo.getHistory();
        } catch (NoSuchElementException | IOException e) {
            System.out.println("Some Error");
        }
        return returnList;
    }

    public yahoofinance.Stock getDetails(String code){

        try {
            return YahooFinance.get(code);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;

    }
    public Boolean existById(Integer id){
        return stockRepository.existsById(id);
    }

}
