package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.DesignationDao;
import com.ereamart.entity.Designation;

@RestController
public class DesignationController {

    @Autowired // genarate instance of designation dao - interface
    private DesignationDao designationDao;

    //request mapping for load designation all data - /designation/alldata
    @GetMapping(value = "/designation/alldata", produces = "application/json")
    public List<Designation> findAllData(){
        return designationDao.findAll();
    } 
}
