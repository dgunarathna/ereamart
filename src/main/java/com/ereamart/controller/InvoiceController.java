package com.ereamart.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class InvoiceController {

    // mapping for return invoice page
    @RequestMapping(value =  {"/invoice","/invoice.html"})
    public ModelAndView uiInvoicePage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();

	ModelAndView invoicePage = new ModelAndView();   
	invoicePage.setViewName("invoice.html");
	invoicePage.addObject("loggedusername", auth.getName());

	return invoicePage;
	}
}
