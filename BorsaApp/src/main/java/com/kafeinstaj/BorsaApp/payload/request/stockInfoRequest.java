package com.kafeinstaj.BorsaApp.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class stockInfoRequest {
    private int id;
    @NotBlank
    @Size(min = 3, max = 20)
    private String name;

    @NotBlank
    @Size(min = 2, max = 5)
    private String code;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
