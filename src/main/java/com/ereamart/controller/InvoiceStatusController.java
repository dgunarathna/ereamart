package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.InvoiceStatusDao;
import com.ereamart.entity.InvoiceStatus;

@RestController
public class InvoiceStatusController {

    @Autowired // genarate instance of employee status dao - interface
    private InvoiceStatusDao invoiceStatusDao;

    //request mapping for load invoicestatus all data - /invoicestatus/alldata
    @GetMapping(value = "/invoicestatus/alldata", produces = "application/json")
    public List<InvoiceStatus> findAllData(){
        return invoiceStatusDao.findAll();
    } 
}
