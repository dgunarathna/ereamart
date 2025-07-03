package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.EmployeeStatusDao;
import com.ereamart.entity.EmployeeStatus;

@RestController
public class EmployeeStatusController {

    @Autowired // genarate instance of employee status dao - interface
    private EmployeeStatusDao employeestatusDao;

    //request mapping for load employee status all data - /employee status/alldata
    @GetMapping(value = "/employeestatus/alldata", produces = "application/json")
    public List<EmployeeStatus> findAllData(){
        return employeestatusDao.findAll();
    } 
}
