package com.ereamart.controller;

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

import com.ereamart.dao.PrivilegeDao;
import com.ereamart.entity.Privilege; 

@RestController
public class PrivilegeController {

	@Autowired
	private PrivilegeDao privilegeDao;
	
	@Autowired
	private UserPrivilegeController userPrivilegeController;

    // mapping for return privilege page
    @RequestMapping(value =  {"/privilege","/privilege.html"})
    public ModelAndView uiPrivilegePage(){
	ModelAndView privilegePage = new ModelAndView();
	privilegePage.setViewName("privilege.html");
	return privilegePage;
	}

	// mapping for get privilege all data 
	@GetMapping(value = "/privilege/alldata", produces = "application/json")
	public List<Privilege> findAllData() {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");

		if (userPrivilege.getPrivi_select()) {
			return privilegeDao.findAll(Sort.by(Direction.DESC, "id"));
		} else {
			return new ArrayList<>();
		}

		
	}

	// mapping for insert privilege data
	@PostMapping(value = "/privilege/insert")
	public String savePrivilegeData(@RequestBody Privilege privilege) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
			Privilege extPrivilege = privilegeDao.getPrivilegeByRoleModule(privilege.getRole_id().getId(), privilege.getModule_id().getId());
			if (extPrivilege != null) {
				return "Save not completed, Privilege allready exist";
			}
	
			try {
				// set auto added data

				// save oparator
				privilegeDao.save(privilege);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	}  

	// mapping for update privilege data
	@PutMapping(value = "/privilege/update")
	public String updatePrivilegeeData(@RequestBody Privilege privilege) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");

		if (userPrivilege.getPrivi_update()) {
			//check ext pk - update / delete only 
			//like employee dhanushka

			//duplicate check
			Privilege extPrivilege = privilegeDao.getPrivilegeByRoleModule(privilege.getRole_id().getId(),privilege.getModule_id().getId());
			if (extPrivilege != null && extPrivilege.getId() != privilege.getId()) {
				return "Update not completed, Privilege allready exist";
			}

			try {
				// set auto added data

				// update oparator
				privilegeDao.save(privilege);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		} else {
			return "Update not completed, No Permission!";
		}

	}
	 
	// mapping for delete privilege data
	@DeleteMapping(value = "/privilege/delete") 
	public String deletePrivilegeData(@RequestBody Privilege privilege) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");

		if (userPrivilege.getPrivi_delete()) {
			//check ext pk - update / delete only - dhanushka

			try {
				// set auto added data

				// delete oparator
				privilege.setPrivi_select(false);
				privilege.setPrivi_insert(false);
				privilege.setPrivi_update(false);
				privilege.setPrivi_delete(false);
				
				privilegeDao.save(privilege);

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