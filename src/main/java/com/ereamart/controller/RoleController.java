package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.RoleDao;
import com.ereamart.entity.Role;

@RestController
public class RoleController {

    @Autowired // genarate instance of role dao - interface
    private RoleDao roleDao;

    //request mapping for load role all data - /role/alldata
    @GetMapping(value = "/role/alldata", produces = "application/json")
    public List<Role> findAllData(){
        return roleDao.findAll();
    } 

    //request mapping for load role without admin all data - /rolewithoutadmin/alldata
    @GetMapping(value = "/role/withoutadmin", produces = "application/json")
    public List<Role> findWithoutAdmin(){
        return roleDao.findWithoutAdmin();
    } 
}
