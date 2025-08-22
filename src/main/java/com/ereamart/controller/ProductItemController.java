package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductItemDao;
import com.ereamart.entity.ProductItem;

@RestController
public class ProductItemController {

    @Autowired // genarate instance of productitem dao - interface
    private ProductItemDao productItemDao;

    //request mapping for load productitem all data - /productitem/alldata
    @GetMapping(value = "/productitem/alldata", produces = "application/json")
    public List<ProductItem> findAllData(){
        return productItemDao.findAll();
    }
}
