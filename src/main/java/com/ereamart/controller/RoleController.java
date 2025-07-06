package com.ereamart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.RoleDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.Role;

@RestController
public class RoleController {

    @Autowired // genarate instance of role dao - interface
    private RoleDao roleDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    //request mapping for load role all data - /role/alldata
    @GetMapping(value = "/role/alldata", produces = "application/json")
    public List<Role> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");
        
        if (userPrivilege.getPrivi_select()) {
            return roleDao.findAll();
        } else {
            return new ArrayList<>();
        }

        
    } 

    //request mapping for load role without admin all data - /rolewithoutadmin/alldata
    @GetMapping(value = "/role/withoutadmin", produces = "application/json")
    public List<Role> findWithoutAdmin(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (userPrivilege.getPrivi_select()) {
            return roleDao.findWithoutAdmin();
        } else {
            return new ArrayList<>();
        }
        
    } 
}
