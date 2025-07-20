package com.ereamart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ReportDao;

@RestController
public class ReportDataController {

    @Autowired
    public ReportDao reportDao;

    //request mapping for load productdepartment all data - /reportpayment/bytime?type=
    @GetMapping(value = "/reportpayment/bytime", params = {"type"} , produces = "application/json")
    public String[][] getPaymentReportDate(@RequestParam("type") String type){
       
        if (type.equals("Monthly")) {
            return reportDao.getPaymentsByMonth();
        }
        if (type.equals("Weekly")) {
            return reportDao.getPaymentsByWeek();
        }
        if (type.equals("Daily")) {
            return reportDao.getPaymentsByDay();
        }
        return new String[0][0];
    } 

    //request mapping for load productdepartment all data - /productdepartment/bycategory
    @GetMapping(value = "/reportpayment/bymonth" , produces = "application/json")
    public String[][] getPaymentReportMonthly(){
        return reportDao.getPaymentsByMonth();
    } 
}
