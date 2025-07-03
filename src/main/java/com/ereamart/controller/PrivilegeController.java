package com.ereamart.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class PrivilegeController {

    // mapping for return privilege page
    @RequestMapping(value =  {"/privilege","/privilege.html"})
    public ModelAndView uiPrivilegePage(){
	ModelAndView privilegePage = new ModelAndView();
	privilegePage.setViewName("privilege.html");
	return privilegePage;
	}
}
