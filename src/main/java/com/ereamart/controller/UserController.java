package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.UserDao;
import com.ereamart.entity.User;

@RestController
public class UserController {

	@Autowired // genarate instance of user dao - interface
    private UserDao userDao;

    // mapping for return user page
    @RequestMapping(value =  {"/user","/user.html"})
    public ModelAndView uiUserPage(){
	ModelAndView userPage = new ModelAndView();
	userPage.setViewName("user.html");
	return userPage;
	}


	//request mapping for load user all data - /user/alldata
    @GetMapping(value = "/user/alldata", produces = "application/json")
    public List<User> findAllData(){
        return userDao.findAll();
    } 
}
