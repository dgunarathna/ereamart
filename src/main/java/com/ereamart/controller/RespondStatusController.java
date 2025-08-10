package com.ereamart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.RespondStatusDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.RespondStatus;

@RestController
public class RespondStatusController {

    @Autowired
    private RespondStatusDao respondStatusDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    //request mapping for load respondstatus all data - /respondstatus/alldata
    @GetMapping(value = "/respondstatus/alldata", produces = "application/json")
    public List<RespondStatus> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Respond");

        if (userPrivilege.getPrivi_select()) {
            return respondStatusDao.findAll();
        } else {
            return new ArrayList<>();
        }
        
    }  
}
