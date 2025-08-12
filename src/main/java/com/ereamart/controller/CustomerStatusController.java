package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.CustomerStatusDao;
import com.ereamart.entity.CustomerStatus;

@RestController
public class CustomerStatusController {

    @Autowired // genarate instance of employee status dao - interface
    private CustomerStatusDao customerStatusDao;

    //request mapping for load customerstatus all data - /customerstatus/alldata
    @GetMapping(value = "/customerstatus/alldata", produces = "application/json")
    public List<CustomerStatus> findAllData(){
        return customerStatusDao.findAll();
    } 
}
