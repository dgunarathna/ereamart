package com.ereamart.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class DashboardController {

    // mapping for return dashboard page
    @RequestMapping(value =  {"/dashboard","/dashboard.html"})
    public ModelAndView uiDashboardPage(){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		
		ModelAndView dashboardPage = new ModelAndView();   
		dashboardPage.setViewName("dashboard.html");
		dashboardPage.addObject("loggedusername", auth.getName());
		return dashboardPage;
	}
}
