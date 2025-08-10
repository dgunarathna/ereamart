package com.ereamart.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
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

import com.ereamart.dao.RespondDao;
import com.ereamart.dao.RespondStatusDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.Respond;
import com.ereamart.entity.User;

@RestController
public class RespondController {

    @Autowired
	private RespondDao respondDao;

	@Autowired // genarate instance of user dao - interface
    private UserDao userDao;

	@Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

	@Autowired // genarate instance of Order status dao
	private RespondStatusDao respondStatusDao;

    // mapping for return quotation html page
    @RequestMapping(value =  {"/respond","/respond.html"})
    public ModelAndView uiEmployeePage(){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView respondPage = new ModelAndView();
		respondPage.setViewName("respond.html");
		respondPage.addObject("loggedusername", auth.getName());
		return respondPage;
	} 

	//request mapping for load respond all data - /respond/alldata
    @GetMapping(value = "/respond/alldata", produces = "application/json")
    public List<Respond> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Respond");

        if (userPrivilege.getPrivi_select()) {
            return respondDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
        
    }

	// mapping for insert respond data
	@PostMapping(value = "/respond/insert")
	public String saveUserData(@RequestBody Respond respond) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Respond");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
	
			try {
				// set auto added data
				respond.setAdded_datetime(LocalDateTime.now());
				respond.setAdded_user_id(loggedUser.getId());
				respond.setRespond_code(respondDao.getNextCode());

				// save oparator
				respondDao.save(respond);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	} 

	// mapping for update respond data
	@PutMapping(value = "/respond/update")
	public String updateUserData(@RequestBody Respond respond) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Respond");
		
		if (userPrivilege.getPrivi_update()) {

			//check ext pk - update / delete only
			if (respond.getId() == null) { // no employee id - with link access
				return "Update not completed, respond already exists" ;
			}

			//duplicate check
			//email

			try {
				// set auto added data
				respond.setUpdate_datetime(LocalDateTime.now());
				respond.setUpdate_user_id(loggedUser.getId());

				// update oparator
				respondDao.save(respond);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		}else {
			return "Update not completed, No Permission!";
		}
	
	}

	// mapping for delete respond data
	@DeleteMapping(value = "/respond/delete") 
	public String deleteEmployeeData(@RequestBody Respond respond) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Respond");
        

		//check ext pk - update / delete only
		if (respond.getId() == null) { // no employee id - with link access
			return "Delete not completed, quotation not exist" ;
		}
		Respond extProductById = respondDao.getReferenceById(respond.getId()); // check id with db
		if (extProductById == null) {
			return "Delete not completed, respond not exist in the database" ;
		}
		 
		try {
			// set auto added data
			extProductById.setDelete_datetime(LocalDateTime.now());
			extProductById.setDelete_user_id(userDao.getByUsename(auth.getName()).getId());
			extProductById.setRespond_status_id(respondStatusDao.getReferenceById(2));

			// delete oparator
			respondDao.save(extProductById);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Delete not completed" + e.getMessage();
		}
	}

}
