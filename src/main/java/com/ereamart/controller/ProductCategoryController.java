package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductCategoryDao;
import com.ereamart.entity.ProductCategory;

@RestController
public class ProductCategoryController {

    @Autowired // genarate instance of designation dao - interface
    private ProductCategoryDao productCategoryDao;

    //request mapping for load designation all data - /designation/alldata
    @GetMapping(value = "/productcategory/alldata", produces = "application/json")
    public List<ProductCategory> findAllData(){
        return productCategoryDao.findAll();
    } 
}
