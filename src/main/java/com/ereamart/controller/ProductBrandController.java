package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductBrandDao;
import com.ereamart.entity.ProductBrand;

@RestController
public class ProductBrandController {

    @Autowired // genarate instance of productbrand dao - interface
    private ProductBrandDao productBrandDao;

    //request mapping for load productbrand all data - /productbrand/alldata
    @GetMapping(value = "/productbrand/alldata", produces = "application/json")
    public List<ProductBrand> findAllData(){
        return productBrandDao.findAll();
    } 

    //request mapping for load productbrand all data - /productbrand/bycategory
    // @GetMapping(value = "/productbrand/bycategory/{categoryid}", produces = "application/json")
    // public List<ProductBrand> findPBrandybyPCategory(@PathVariable("categoryid") Integer categoryid){
    //     return productBrandDao.findPBrandybyPCategory(categoryid);
    // } 
}
