package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductStatusDao;
import com.ereamart.entity.ProductStatus;

@RestController
public class ProductStatusController {

    @Autowired // genarate instance of designation dao - interface
    private ProductStatusDao productStatusDao;

    //request mapping for load designation all data - /designation/alldata
    @GetMapping(value = "/productstatus/alldata", produces = "application/json")
    public List<ProductStatus> findAllData(){
        return productStatusDao.findAll();
    } 
}
