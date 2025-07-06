package com.ereamart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.EmployeeStatusDao;
import com.ereamart.entity.EmployeeStatus;
import com.ereamart.entity.Privilege;

@RestController
public class EmployeeStatusController {

    @Autowired // genarate instance of employee status dao - interface
    private EmployeeStatusDao employeestatusDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    //request mapping for load employee status all data - /employee status/alldata
    @GetMapping(value = "/employeestatus/alldata", produces = "application/json")
    public List<EmployeeStatus> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");


        if (userPrivilege.getPrivi_select()) {
            return employeestatusDao.findAll();
        } else {
            return new ArrayList<>();
        }

        
    } 
}
