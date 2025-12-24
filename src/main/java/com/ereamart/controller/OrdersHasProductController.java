package com.ereamart.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.OrdersHasProductDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Privilege;

@RestController
public class OrdersHasProductController {

    @Autowired // genarate instance of orders has product dao
    private OrdersHasProductDao ordersHasProductDao;

    @Autowired // genarate instance of user dao
    private UserDao userDao;

    @Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

    //  request mapping for load productbrand all data - /product/byquotation
    @GetMapping(value = "/unitprice/byorder/{orderID}/byproduct/{productID}", produces = "application/json")
    public BigDecimal  findUnitPriceByOrderAndProduct(@PathVariable("orderID") Integer orderID, @PathVariable("productID") Integer productID){
		
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Orders");

			if (userPrivilege.getPrivi_select()) {
			return ordersHasProductDao.findUnitPriceByOrderAndProduct(orderID, productID);
			} else {
				return null;
			}
    }

    //  request mapping for load productbrand all data - /product/byquotation
    @GetMapping(value = "/qty/byorder/{orderID}/byproduct/{productID}", produces = "application/json")
    public BigDecimal  findQTYByOrderAndProduct(@PathVariable("orderID") Integer orderID, @PathVariable("productID") Integer productID){
		
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Orders");

			if (userPrivilege.getPrivi_select()) {
			return ordersHasProductDao.findQTYByOrderAndProduct(orderID, productID);
			} else {
				return null;
			}
    }
}
