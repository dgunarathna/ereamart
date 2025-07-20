package com.ereamart.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class GRNController { 

    // mapping for return grn page
    @RequestMapping(value =  {"/grn","/grn.html"})
    public ModelAndView uiGRNPage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();

	ModelAndView grnPage = new ModelAndView();   
	grnPage.setViewName("grn.html");
	grnPage.addObject("loggedusername", auth.getName());

	return grnPage;
	}
}
