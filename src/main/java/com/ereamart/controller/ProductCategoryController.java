package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductCategoryDao;
import com.ereamart.entity.ProductCategory;

@RestController
public class ProductCategoryController {

    @Autowired // genarate instance of productcategory dao - interface
    private ProductCategoryDao productCategoryDao;

    //request mapping for load productcategory all data - /productcategory/alldata
    @GetMapping(value = "/productcategory/alldata", produces = "application/json")
    public List<ProductCategory> findAllData(){
        return productCategoryDao.findAll();
    } 
}
