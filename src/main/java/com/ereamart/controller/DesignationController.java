package com.ereamart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.DesignationDao;
import com.ereamart.entity.Designation;
import com.ereamart.entity.Privilege;

@RestController
public class DesignationController {


    @Autowired // genarate instance of designation dao - interface
    private DesignationDao designationDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    //request mapping for load designation all data - /designation/alldata
    @GetMapping(value = "/designation/alldata", produces = "application/json")
    public List<Designation> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (userPrivilege.getPrivi_select()) {
            return designationDao.findAll();
        } else {
            return new ArrayList<>();
        }


        
    } 
}
