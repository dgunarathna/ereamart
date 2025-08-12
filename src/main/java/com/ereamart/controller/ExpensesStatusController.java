package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ExpensesStatusDao;
import com.ereamart.entity.ExpensesStatus;

@RestController
public class ExpensesStatusController {

    @Autowired // genarate instance of employee status dao - interface
    private ExpensesStatusDao expensesStatusDao;

    //request mapping for load expensesstatus all data - /expensesstatus/alldata
    @GetMapping(value = "/expensesstatus/alldata", produces = "application/json")
    public List<ExpensesStatus> findAllData(){
        return expensesStatusDao.findAll();
    } 
}
