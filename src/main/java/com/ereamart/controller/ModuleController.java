package com.ereamart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ModuleDao;
import com.ereamart.entity.Privilege;

@RestController
public class ModuleController {

    @Autowired // genarate instance of module dao - interface
    private ModuleDao moduleDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    //request mapping for load module all data - /module/alldata
    @GetMapping(value = "/module/alldata", produces = "application/json")
    public List<com.ereamart.entity.Module> findAllData(){

         //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");

        if (userPrivilege.getPrivi_select()) {
            return moduleDao.findAll();
        } else {
            return new ArrayList<>();
        }

        
    } 
}
