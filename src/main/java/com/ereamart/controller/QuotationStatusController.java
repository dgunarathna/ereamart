package com.ereamart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.QuotationStatusDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.QuotationStatus;

@RestController
public class QuotationStatusController {

    @Autowired
    private QuotationStatusDao quotationStatusDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    //request mapping for load quotationstatus all data - /quotationstatus/alldata
    @GetMapping(value = "/quotationstatus/alldata", produces = "application/json")
    public List<QuotationStatus> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Quotation");

        if (userPrivilege.getPrivi_select()) {
            return quotationStatusDao.findAll();
        } else {
            return new ArrayList<>();
        }
        
    } 

}
