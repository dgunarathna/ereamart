package com.ereamart.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ExpenseController {

    // mapping for return expense page
    @RequestMapping(value =  {"/expense","/expense.html"})
    public ModelAndView uiexpensePage(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView expensePage = new ModelAndView();
        expensePage.setViewName("expense.html");
		expensePage.addObject("loggedusername", auth.getName());
        return expensePage;
	}
}
