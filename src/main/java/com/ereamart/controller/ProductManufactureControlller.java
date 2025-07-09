package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductManufactureDao;
import com.ereamart.entity.ProductManufacture;

@RestController
public class ProductManufactureControlller {

    @Autowired // genarate instance of designation dao - interface
    private ProductManufactureDao productManufactureDao;

    //request mapping for load designation all data - /designation/alldata
    @GetMapping(value = "/productmanufacture/alldata", produces = "application/json")
    public List<ProductManufacture> findAllData(){
        return productManufactureDao.findAll();
    } 
}
