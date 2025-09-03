package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ModuleDao;

@RestController
public class ModuleController {

    @Autowired // genarate instance of module dao - interface
    private ModuleDao moduleDao;

    //request mapping for load module all data - /module/alldata
    @GetMapping(value = "/module/alldata", produces = "application/json")
    public List<com.ereamart.entity.Module> findAllData(){
        return moduleDao.findAll();
    } 

    //request mapping for load module all data - /module/withoutprivilege
    @GetMapping(value = "/module/withoutprivilege", produces = "application/json")
    public List<com.ereamart.entity.Module> modulesWithoutDPR(){
        return moduleDao.modulesWithoutDPR();
    } 
}     