package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductDepartmentDao;
import com.ereamart.entity.ProductDepartment;

@RestController
public class ProductDepartmentController {

    @Autowired // genarate instance of designation dao - interface
    private ProductDepartmentDao productDepartmentDao;

    //request mapping for load designation all data - /designation/alldata
    @GetMapping(value = "/productdepartment/alldata", produces = "application/json")
    public List<ProductDepartment> findAllData(){
        return productDepartmentDao.findAll();
    } 
}
