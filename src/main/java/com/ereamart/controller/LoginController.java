package com.ereamart.controller;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.RoleDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Role;
import com.ereamart.entity.User;

@RestController
public class LoginController {

	@Autowired
	private UserDao userDao;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private RoleDao roleDao; 

    // mapping for return login page
    @RequestMapping(value =  {"/login","/login.html"})
    public ModelAndView uiLoginPage(){
		ModelAndView loginPage = new ModelAndView();
		loginPage.setViewName("login.html");
		return loginPage;
	}

	// mapping for return error page
    @RequestMapping(value =  {"/error","/error.html"})
    public ModelAndView uiErrorPage(){
		ModelAndView errorPage = new ModelAndView();
		errorPage.setViewName("error.html");
		return errorPage;
	}

	// mapping for createadmin account
    @RequestMapping(value =  {"/createadmin"})
    public ModelAndView genarateAdminAccount(){

		User extAdminUser = userDao.geByUsename("Admin");
		if (extAdminUser == null) {
			User adminUser = new User();
			adminUser.setUsername("Admin");
			adminUser.setEmail("Admin@gmail.com");
			adminUser.setStatus(true);
			adminUser.setAdded_datetime(LocalDateTime.now());
			adminUser.setPassword(bCryptPasswordEncoder.encode("Admin"));

			Set<Role> roles = new HashSet<>();
			Role adminRole = roleDao.getReferenceById(1);
			roles.add(adminRole);

			adminUser.setRoles(roles); 
			
			userDao.save(adminUser);
		}


		ModelAndView loginPage = new ModelAndView();
		loginPage.setViewName("login.html");
		return loginPage;
	}

}
 