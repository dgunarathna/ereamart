package com.ereamart.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.RespondHasProductDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Privilege;

@RestController
public class RespondHasProductController {
    
    @Autowired // genarate instance of respond has product dao
    private RespondHasProductDao respondHasProductDao;

    @Autowired // genarate instance of user dao
    private UserDao userDao;

    @Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

    //  request mapping for load productbrand all data - /product/byquotation
    @GetMapping(value = "/unitprice/byrespond/{respondID}/byproduct/{productID}", produces = "application/json")
    public BigDecimal  findUnitPriceByRespondAndProduct(@PathVariable("respondID") Integer respondID, @PathVariable("productID") Integer productID){
		
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

			if (userPrivilege.getPrivi_select()) {
			return respondHasProductDao.findUnitPriceByRespondAndProduct(respondID, productID);
			} else {
				return null;
			}
    }
}
