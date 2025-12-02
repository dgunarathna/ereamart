package com.ereamart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductBrandDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.ProductBrand;

@RestController
public class ProductBrandController {

    @Autowired // genarate instance of productbrand dao - interface
    private ProductBrandDao productBrandDao;

    @Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

    //request mapping for load productbrand all data - /productbrand/alldata
    @GetMapping(value = "/productbrand/alldata", produces = "application/json")
    public List<ProductBrand> findAllData(){
        return productBrandDao.findAll();
    } 

    
	//  request mapping for load productbrand all data - /brands/bymanufcature/{manufactureid}
    @GetMapping(value = "/brands/bymanufcature/{manufactureid}", produces = "application/json")
    public List<ProductBrand> findBrnadbyManufacture(@PathVariable("manufactureid") Integer manufactureid){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

			if (userPrivilege.getPrivi_select()) {
			return productBrandDao.findBrnadbyManufacture(manufactureid);
			} else {
				return new ArrayList<>();
			}
    }
}
