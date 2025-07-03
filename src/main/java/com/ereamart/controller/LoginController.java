package com.ereamart.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class LoginController {

    // mapping for return login page
    @RequestMapping(value =  {"/login","/login.html"})
    public ModelAndView uiLoginPage(){
	ModelAndView loginPage = new ModelAndView();
	loginPage.setViewName("login.html");
	return loginPage;
	}
}
 