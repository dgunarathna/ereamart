package com.ereamart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.OrdersStatusDao;
import com.ereamart.entity.OrdersStatus;
import com.ereamart.entity.Privilege;

@RestController
public class OrdersStatusController {

    @Autowired
    private OrdersStatusDao ordersStatusDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    //request mapping for load ordersstatus all data - /ordersstatus/alldata
    @GetMapping(value = "/ordersstatus/alldata", produces = "application/json")
    public List<OrdersStatus> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Orders");

        if (userPrivilege.getPrivi_select()) {
            return ordersStatusDao.findAll();
        } else {
            return new ArrayList<>();
        }
        
    }  
}
