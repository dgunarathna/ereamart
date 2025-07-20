package com.ereamart.controller;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.RoleDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.ChangeUser;
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
		SecurityContextHolder.clearContext();
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

		User extAdminUser = userDao.getByUsename("Admin");
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

	// mapping for return profile page
    @RequestMapping(value =  {"/loggeduserdetail"})
    public ChangeUser getLoggedUserDetail(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	User loggedUser = userDao.getByUsename(auth.getName());

	ChangeUser changeUser = new ChangeUser();
	changeUser.setUsername(loggedUser.getUsername());
	changeUser.setOldusername(loggedUser.getUsername());
	changeUser.setEmail(loggedUser.getEmail());
	changeUser.setUserphoto(loggedUser.getUserphoto());

	return changeUser;
	}

	// mapping for change user data
	@PostMapping(value = "/changeuserdetails/insert")
	public String updateEmployeeData(@RequestBody ChangeUser changeUser) {
		//check logged user authorization

		//check ext pk - update / delete only
		User extUser = userDao.getByUsename(changeUser.getOldusername()); // check id with db
		if (extUser == null) {
			return "Update not completed, user already exists" ;
		}  

		//duplicate check
		User extUserByUsername = userDao.getByUsename(changeUser.getUsername()); // check id with db
		if (extUserByUsername != null && extUser.getId() != extUserByUsername.getId()) {
			return "Update not completed, User already exists" ;
		};


		try {

			//check password
			if (changeUser.getOldpassword() != null) {
				if (bCryptPasswordEncoder.matches(changeUser.getOldpassword(), extUser.getPassword())) {
					if (!bCryptPasswordEncoder.matches(changeUser.getNewpassword(), extUser.getPassword())) {
						extUser.setPassword(bCryptPasswordEncoder.encode(changeUser.getNewpassword()));
					} return "Update not completed, Password not changed" ;
				} else {
					return "Update not completed, Old password not correct" ;
				}
			}
			// set auto added data
			extUser.setUsername(changeUser.getUsername());
			extUser.setEmail(changeUser.getEmail());
			extUser.setUserphoto(changeUser.getUserphoto());

			// update oparator
			userDao.save(extUser);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Update not completed" + e.getMessage();
		}
	}
	 
}
 
