package com.kafeinstaj.BorsaApp.controller;

import com.kafeinstaj.BorsaApp.model.Stock;
import com.kafeinstaj.BorsaApp.payload.response.quoteResponse;
import com.kafeinstaj.BorsaApp.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yahoofinance.histquotes.HistoricalQuote;

import java.text.DecimalFormat;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/stocks")

public class StockController {

    @Autowired
    StockService stockService;

    @GetMapping("")
    public List<Stock> list() {
        return stockService.listAllStocks();
    }


    @GetMapping("/{id}")
    public ResponseEntity<List<HistoricalQuote>> getHistoricalData(@PathVariable Integer id) {
        Stock stock = stockService.getStock(id);
        List<HistoricalQuote> stockHistQuotes = stockService.getHistoricalData(stock.getCode());
        return new ResponseEntity<List<HistoricalQuote>>(stockHistQuotes, HttpStatus.OK);
    }

    @GetMapping("/chart/{code}")
    public ResponseEntity<List<HistoricalQuote>> getChartData(@PathVariable String code) {
        List<HistoricalQuote> stockHistQuotes = stockService.getHistoricalData(code);
        return new ResponseEntity<List<HistoricalQuote>>(stockHistQuotes, HttpStatus.OK);
    }


    @PostMapping("/getAssetsDetails")
    public List<quoteResponse> getAssetsDetails(@RequestBody List<String> stockCodes) {
        DecimalFormat df = new DecimalFormat("#,###.##");
        List<quoteResponse> response = new ArrayList<quoteResponse>();
        for (String index : stockCodes) {
            yahoofinance.Stock stock = stockService.getDetails(index);
            if (stock != null) {
                if (stock.getQuote().getPrice() != null) {
                    if (stock.getQuote().getPreviousClose() != null) {
                        quoteResponse item = new quoteResponse();
                        item.setCode(stock.getSymbol());
                        item.setName(stock.getName());
                        Double price = stock.getQuote().getPrice().doubleValue();
                        item.setPrice(price);
                        Double priceChange = stock.getQuote().getPrice().doubleValue() - stock.getQuote().getPreviousClose().doubleValue();
                        item.setPriceChange(df.format(priceChange));
                        Double percentage = ((stock.getQuote().getPrice().doubleValue() - stock.getQuote().getPreviousClose().doubleValue()) / stock.getQuote().getPreviousClose().doubleValue()) * 100;
                        item.setChangePercentage(df.format(percentage));
                        item.setDate(stock.getQuote().getLastTradeTime());
                        response.add(item);
                    }}
            }

        }
        return response;
    }
}

