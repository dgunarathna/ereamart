package com.ereamart.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class InventoryController {


    // mapping for return inventory page
    @RequestMapping(value =  {"/inventory","/inventory.html"})
    public ModelAndView uiInventoryPage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();

	ModelAndView inventoryPage = new ModelAndView();   
	inventoryPage.setViewName("inventory.html");
	inventoryPage.addObject("loggedusername", auth.getName());

	return inventoryPage;
	}
}
