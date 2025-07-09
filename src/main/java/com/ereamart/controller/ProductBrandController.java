package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductBrandDao;
import com.ereamart.entity.ProductBrand;

@RestController
public class ProductBrandController {

    @Autowired // genarate instance of designation dao - interface
    private ProductBrandDao productBrandDao;

    //request mapping for load designation all data - /designation/alldata
    @GetMapping(value = "/productbrand/alldata", produces = "application/json")
    public List<ProductBrand> findAllData(){
        return productBrandDao.findAll();
    } 
}
