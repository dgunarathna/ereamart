package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.entity.SupplierStatus;
import com.ereamart.entity.SupplierStatusDao;

@RestController
public class SupplierStatusController {

    @Autowired // genarate instance of supplier Status dao - interface
    private SupplierStatusDao supplierStatusDao;

    //request mapping for load supplier Status all data - /supplierstatus/alldata
    @GetMapping(value = "/supplierstatus/alldata", produces = "application/json")
    public List<SupplierStatus> findAllData(){
        return supplierStatusDao.findAll(); 
    } 
}
