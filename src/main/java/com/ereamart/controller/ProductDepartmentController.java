package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductDepartmentDao;
import com.ereamart.entity.ProductDepartment;

@RestController
public class ProductDepartmentController {

    @Autowired // genarate instance of productdepartment dao - interface 
    private ProductDepartmentDao productDepartmentDao;

    //request mapping for load productdepartment all data - /productdepartment/alldata
    @GetMapping(value = "/productdepartment/alldata", produces = "application/json")
    public List<ProductDepartment> findAllData(){
        return productDepartmentDao.findAll();
    } 

    //request mapping for load productdepartment all data - /productdepartment/bycategory
    // @GetMapping(value = "/productdepartment/bycategory", params = {"categoryid"} , produces = "application/json")
    // public List<ProductDepartment> findDepartmentByCategory(@RequestParam("categoryid") Integer categoryid){
    //     return productDepartmentDao.findDepartmentByCategory(categoryid);
    // } 

}
