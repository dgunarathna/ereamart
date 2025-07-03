package com.ereamart.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class UserController {

    // mapping for return user page
    @RequestMapping(value =  {"/user","/user.html"})
    public ModelAndView uiUserPage(){
	ModelAndView userPage = new ModelAndView();
	userPage.setViewName("user.html");
	return userPage;
	}
}
