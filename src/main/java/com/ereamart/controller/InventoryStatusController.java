package com.ereamart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.InventoryStatusDao;
import com.ereamart.entity.InventoryStatus;
import com.ereamart.entity.Privilege;

@RestController
public class InventoryStatusController {

    @Autowired
    private InventoryStatusDao inventoryStatusDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    //request mapping for load grn Status all data - /grnstatus/alldata
    @GetMapping(value = "/inventorystatus/alldata", produces = "application/json")
    public List<InventoryStatus> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Inventory");

        if (userPrivilege.getPrivi_select()) {
            return inventoryStatusDao.findAll();
        } else {
            return new ArrayList<>();
        }
        
    } 

}
