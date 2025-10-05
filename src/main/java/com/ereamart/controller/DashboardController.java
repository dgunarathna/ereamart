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
public class DashboardController {

	@Autowired
	private UserDao userDao;

	// mapping for return dashboard page
    @RequestMapping(value =  {"/dashboard","/dashboard.html"})
    public ModelAndView uiDashboardPage(){
		
	//check logged user authorization
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	User loggedUser = userDao.getByUsename(auth.getName());

	ModelAndView dashboardPage = new ModelAndView();   
	dashboardPage.setViewName("dashboard.html");
	dashboardPage.addObject("loggedusername", auth.getName());
    dashboardPage.addObject("pageTitle", "Dashboard");
	dashboardPage.addObject("loggeduserphoto", loggedUser.getUserphoto());

	return dashboardPage;
	}

	// mapping for return profile page
    @RequestMapping(value =  {"/profile","/profile.html"})
    public ModelAndView uiProfilePage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	User loggedUser = userDao.getByUsename(auth.getName());


	ModelAndView profilePage = new ModelAndView();   
	profilePage.setViewName("profile.html");
	profilePage.addObject("loggedusername", auth.getName());
	profilePage.addObject("pageTitle", "Profile");
	profilePage.addObject("loggeduserphoto", loggedUser.getUserphoto());

	return profilePage;
	}

	


}

