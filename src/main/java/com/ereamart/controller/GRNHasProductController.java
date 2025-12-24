package com.ereamart.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.GRNHasProductDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Privilege;

@RestController
public class GRNHasProductController {

    @Autowired // genarate instance of orders has product dao
    private GRNHasProductDao grnHasProductDao;

    @Autowired // genarate instance of user dao
    private UserDao userDao;

    @Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

    //  request mapping for load productbrand all data - /product/byquotation
    @GetMapping(value = "/batch/bygrn/{grnID}/byproduct/{productID}", produces = "application/json")
    public String  findBatchNoByGRNAndProduct(@PathVariable("grnID") Integer grnID, @PathVariable("productID") Integer productID){
		
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

			if (userPrivilege.getPrivi_select()) {
			return grnHasProductDao.findBatchNoByGRNAndProduct(grnID, productID);
			} else {
				return null;
			}
    }

	 //  request mapping for load productbrand all data - /product/byquotation
    @GetMapping(value = "/qty/bygrn/{grnID}/byproduct/{productID}", produces = "application/json")
    public Integer  findQtyByGRNAndProduct(@PathVariable("grnID") Integer grnID, @PathVariable("productID") Integer productID){
		
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

			if (userPrivilege.getPrivi_select()) {
			return grnHasProductDao.findQtyByGRNAndProduct(grnID, productID);
			} else {
				return null;
			}
    }


	//  request mapping for load productbrand all data - /product/byquotation
    @GetMapping(value = "/price/bygrn/{grnID}/byproduct/{productID}", produces = "application/json")
    public BigDecimal  findPriceByGRNAndProduct(@PathVariable("grnID") Integer grnID, @PathVariable("productID") Integer productID){
		
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

			if (userPrivilege.getPrivi_select()) {
			return grnHasProductDao.findPriceByGRNAndProduct(grnID, productID);
			} else {
				return null;
			}
    }

}
