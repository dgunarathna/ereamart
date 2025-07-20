package com.ereamart.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class IncomeController {


    // mapping for return income page
    @RequestMapping(value =  {"/income","/income.html"})
    public ModelAndView uiIncomePage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();

	ModelAndView incomePage = new ModelAndView();   
	incomePage.setViewName("income.html");
	incomePage.addObject("loggedusername", auth.getName());

	return incomePage;
	}
}
