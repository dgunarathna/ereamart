package com.ereamart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.GRNStatusDao;
import com.ereamart.entity.GRNStatus;
import com.ereamart.entity.Privilege;

@RestController
public class GRNStatusController {

    @Autowired
    private GRNStatusDao grnStatusDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    //request mapping for load grn Status all data - /grnstatus/alldata
    @GetMapping(value = "/grnstatus/alldata", produces = "application/json")
    public List<GRNStatus> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

        if (userPrivilege.getPrivi_select()) {
            return grnStatusDao.findAll();
        } else {
            return new ArrayList<>();
        }
        
    } 

}
