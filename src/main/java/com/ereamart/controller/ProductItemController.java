package com.ereamart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductItemDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.ProductItem;

@RestController
public class ProductItemController {

    @Autowired // genarate instance of productitem dao - interface
    private ProductItemDao productItemDao;

    @Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

    //request mapping for load productitem all data - /productitem/alldata
    @GetMapping(value = "/productitem/alldata", produces = "application/json")
    public List<ProductItem> findAllData(){
        return productItemDao.findAll();
    }

    //  request mapping for load productbrand all data - /productitem/bybrand/
    @GetMapping(value = "/productitem/bybrand/{brandid}", produces = "application/json")
    public List<ProductItem> findProductItemByBrandID(@PathVariable("brandid") Integer brandid){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

			if (userPrivilege.getPrivi_select()) {
			return productItemDao.findProductItemByBrandID(brandid);
			} else {
				return new ArrayList<>();
			}
    }
}
