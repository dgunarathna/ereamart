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

import com.ereamart.dao.GRNDao;
import com.ereamart.dao.GRNStatusDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.GRN;
import com.ereamart.entity.GRNHasProduct;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.User;

@RestController
public class GRNController { 

	@Autowired // genarate instance of GRN dao - interface
    private GRNDao grnDao;

	@Autowired // genarate instance of user dao - interface
    private UserDao userDao;

	@Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

    @Autowired // genarate instance of Order status dao
	private GRNStatusDao grnStatusDao;

    // mapping for return grn page
    @RequestMapping(value =  {"/grn","/grn.html"})
    public ModelAndView uiGRNPage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();

	ModelAndView grnPage = new ModelAndView();   
	grnPage.setViewName("grn.html");
	grnPage.addObject("loggedusername", auth.getName());

	return grnPage;
	}

	//request mapping for load grn all data - /grn/alldata
    @GetMapping(value = "/grn/alldata", produces = "application/json")
    public List<GRN> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

        if (userPrivilege.getPrivi_select()) {
            return grnDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
        
    }

    // mapping for insert grn data
	@PostMapping(value = "/grn/insert")
	public String saveUserData(@RequestBody GRN grn) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
	
			try {
				// set auto added data
				grn.setAdded_datetime(LocalDateTime.now());
				grn.setAdded_user_id(loggedUser.getId());
				grn.setGrn_no(grnDao.getNextOrderCode());

				// save oparator
				for (GRNHasProduct grnhp : grn.getGrnHasProductList()) { //due to block inner form 
					grnhp.setGrn_id(grn);
				}
				grnDao.save(grn);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}

	} 

    // mapping for update grn data
	@PutMapping(value = "/grn/update")
	public String updateUserData(@RequestBody GRN grn) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");
		
		if (userPrivilege.getPrivi_update()) {

			//check ext pk - update / delete only
			if (grn.getId() == null) { // no employee id - with link access
				return "Update not completed, product already exists" ;
			}
			GRN extById = grnDao.getReferenceById(grn.getId()); // check id with db
			if (extById == null) {
				return "Update not completed, product already exists" ;
			}  

			//duplicate check
			//email

			try {
				// set auto added data
				grn.setUpdate_datetime(LocalDateTime.now());
				grn.setUpdate_user_id(loggedUser.getId());

				// update oparator
				for (GRNHasProduct grnhp : grn.getGrnHasProductList()) { //due to block inner form 
					grnhp.setGrn_id(grn);
				}
				grnDao.save(grn);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		}else {
			return "Update not completed, No Permission!";
		}
	
	}

	// mapping for delete grn data
	@DeleteMapping(value = "/grn/delete") 
	public String deleteEmployeeData(@RequestBody GRN grn) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "GRN");
        

		//check ext pk - update / delete only
		if (grn.getId() == null) { // no employee id - with link access
			return "Delete not completed, product not exist" ;
		}
		GRN extProductById = grnDao.getReferenceById(grn.getId()); // check id with db
		if (extProductById == null) {
			return "Delete not completed, product not exist in the database" ;
		}
		 
		try {
			// set auto added data
			extProductById.setDelete_datetime(LocalDateTime.now());
			extProductById.setDelete_user_id(userDao.getByUsename(auth.getName()).getId());
			extProductById.setGrn_status_id(grnStatusDao.getReferenceById(2));

			// delete oparator
			grnDao.save(extProductById);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Delete not completed" + e.getMessage();
		}
	}

}
