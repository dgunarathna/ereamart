package com.ereamart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.UserDao;
import com.ereamart.entity.User;

@RestController
public class HomeController {

    @Autowired
	private UserDao userDao;
    
    // mapping for return home page
    @RequestMapping(value =  {"/home","/home.html"})
    public ModelAndView uiHomePage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	User loggedUser = userDao.getByUsename(auth.getName());


	ModelAndView homePage = new ModelAndView();   
	homePage.setViewName("home.html");
	homePage.addObject("loggedusername", auth.getName());
	homePage.addObject("pageTitle", "Home");
	homePage.addObject("loggeduserphoto", loggedUser.getUserphoto());

	return homePage;
	}

	// mapping for return home page
    @RequestMapping(value =  {"/cart","/cart.html"})
    public ModelAndView uiCartPage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	User loggedUser = userDao.getByUsename(auth.getName());


	ModelAndView cartPage = new ModelAndView();   
	cartPage.setViewName("cart.html");
	cartPage.addObject("loggedusername", auth.getName());
	cartPage.addObject("loggeduserphoto", loggedUser.getUserphoto());

	return cartPage;
	}
}
