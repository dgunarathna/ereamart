package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductDao;
import com.ereamart.entity.Product;

@RestController
public class ProductController {

    @Autowired // genarate instance of product dao - interface
    private ProductDao productDao;

    //request mapping for load product all data - /product/alldata
    @GetMapping(value = "/product/alldata", produces = "application/json")
    public List<Product> findAllData(){
        return productDao.findAll();
    } 
}
