package com.ereamart.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class CustomerController {


    // mapping for return customer page
    @RequestMapping(value =  {"/customer","/customer.html"})
    public ModelAndView uiCustomerPage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();

	ModelAndView customerPage = new ModelAndView();   
	customerPage.setViewName("customer.html");
	customerPage.addObject("loggedusername", auth.getName());

	return customerPage;
	}
}
