package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.IncomeStatusDao;
import com.ereamart.entity.IncomeStatus;

@RestController
public class IncomeStatusController {

    @Autowired // genarate instance of employee status dao - interface
    private IncomeStatusDao incomeStatusDao;

    //request mapping for load incomestatus all data - /incomestatus/alldata
    @GetMapping(value = "/incomestatus/alldata", produces = "application/json")
    public List<IncomeStatus> findAllData(){
        return incomeStatusDao.findAll();
    } 
}
