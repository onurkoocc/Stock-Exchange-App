package com.kafeinstaj.BorsaApp.payload.request;

import javax.validation.constraints.NotBlank;
import java.util.Calendar;

public class transactionRequest {

    @NotBlank
    private Integer userId;

    private String code;

    private Integer stockCount;

    private Double price;

    private Calendar date;

    public Calendar getDate() {
        return date;
    }

    public void setDate(Calendar date) {
        this.date = date;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getStockCount() {
        return stockCount;
    }

    public void setStockCount(Integer stockCount) {
        this.stockCount = stockCount;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
