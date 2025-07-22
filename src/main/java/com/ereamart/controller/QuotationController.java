package com.ereamart.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class QuotationController {

        // mapping for return employee html page
    @RequestMapping(value =  {"/quotation","/quotation.html"})
    public ModelAndView uiEmployeePage(){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView quotationPage = new ModelAndView();
		quotationPage.setViewName("quotation.html");
		quotationPage.addObject("loggedusername", auth.getName());
		return quotationPage;
	} 


	
}
