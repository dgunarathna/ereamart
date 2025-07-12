package com.ereamart.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.UserDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.User;

@RestController
public class UserController {

	@Autowired // genarate instance of user dao - interface
    private UserDao userDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    // mapping for return user page
    @RequestMapping(value =  {"/user","/user.html"})
    public ModelAndView uiUserPage(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView userPage = new ModelAndView();
        userPage.setViewName("user.html");
		userPage.addObject("loggedusername", auth.getName());
        return userPage;
	}

	//request mapping for load user all data - /user/alldata
    @GetMapping(value = "/user/alldata", produces = "application/json")
    public List<User> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (userPrivilege.getPrivi_select()) {
            return userDao.findAll(auth.getName());
        } else {
            return new ArrayList<>();
        }
        
    } 

	// mapping for insert privilege data
	@PostMapping(value = "/user/insert")
	public String saveUserData(@RequestBody User user) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
			User extPrivilege = userDao.getByUsename(user.getUsername());
			if (extPrivilege != null) {
				return "Save not completed, Privilege allready exist";
			}
	
			try {
				// set auto added data

				// save oparator
				userDao.save(user);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	}  

	// mapping for update user data
	@PutMapping(value = "/user/update")
	public String updateUserData(@RequestBody User user) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");
		
		if (userPrivilege.getPrivi_update()) {

			//check ext pk - update / delete only
			if (user.getId() == null) { // no employee id - with link access
				return "Update not completed, NIC already exists" ;
			}
			User extById = userDao.getReferenceById(user.getId()); // check id with db
			if (extById == null) {
				return "Update not completed, NIC already exists" ;
			}  

			//duplicate check
			//email

			try {
				// set auto added data
				user.setUpdate_datetime(LocalDateTime.now());

				// update oparator
				userDao.save(user);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		}else {
			return "Update not completed, No Permission!";
		}
	
	}
	 
	// mapping for delete user data
	@DeleteMapping(value = "/user/delete") 
	public String deleteUserData(@RequestBody User user) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

		if (userPrivilege.getPrivi_delete()) {

			//check ext pk - update / delete only - dhanushka
            if (user.getId() == null) { // no employee id - with link access
			    return "Delete not completed, Employee not exist" ;
            }
            User extUserById = userDao.getReferenceById(user.getId()); // check id with db
            if (extUserById == null) {
                return "Delete not completed, Employee not exist in the database" ;
            }

			try {
				// set auto added data

				// delete oparator
				
				extUserById.setStatus(false);;
                extUserById.setDelete_datetime(LocalDateTime.now());

                userDao.save(extUserById);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Delete not completed" + e.getMessage();
			}
		} else {
			return "Delete not completed, No Permission!";
		}

	}


}
