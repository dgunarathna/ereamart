package com.ereamart.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class DashboardController {

    // mapping for return dashboard page
    @RequestMapping(value =  {"/dashboard","/dashboard.html"})
    public ModelAndView uiDashboardPage(){
	ModelAndView dashboardPage = new ModelAndView();   
	dashboardPage.setViewName("dashboard.html");
	return dashboardPage;
	}
}
