package com.ereamart.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class RegisterController {

    // mapping for return employee page
    @RequestMapping(value =  {"/register","/register.html"})
    public ModelAndView uiRegisterPage(){
	ModelAndView registerPage = new ModelAndView();
	registerPage.setViewName("register.html");
	return registerPage;
	}
}



   