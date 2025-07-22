package com.ereamart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.ReportDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.User;

@RestController
public class ReportController {

	@Autowired
    public ReportDao reportDao;

    @Autowired
	private UserDao userDao;

    // mapping for return report page
    @RequestMapping(value =  {"/report","/report.html"})
    public ModelAndView uiReportPage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	User loggedUser = userDao.getByUsename(auth.getName());

	ModelAndView reportPage = new ModelAndView();   
	reportPage.setViewName("report.html");
	reportPage.addObject("loggedusername", auth.getName());
	reportPage.addObject("loggeduserphoto", loggedUser.getUserphoto());

	return reportPage;
	}


	//request mapping for load productdepartment all data - /productdepartment/bycategory
    @GetMapping(value = "/reportpayment/bymonth" , produces = "application/json")
    public String[][] getPaymentReportMonthly(){
        return reportDao.getPaymentsByMonthly();
    } 


    //request mapping for load productdepartment all data - /reportpayment/bytime?type=
    @GetMapping(value = "/reportpayment/bytime", params = {"startdate","enddate","type"} , produces = "application/json")
    public String[][] getPaymentReportByTime(@RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){
       
        if (type.equals("Monthly")) {
            return reportDao.getPaymentsByMonth(startdate, enddate);
        }
        if (type.equals("Weekly")) {
            return reportDao.getPaymentsByweek(startdate, enddate);
        }
        if (type.equals("Daily")) {
            return reportDao.getPaymentsByDay(startdate, enddate);
        }
        return new String[0][0];
    } 

    
}
