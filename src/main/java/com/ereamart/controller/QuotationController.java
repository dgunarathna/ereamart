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

import com.ereamart.dao.QuotationDao;
import com.ereamart.dao.QuotationStatusDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.Quotation;
import com.ereamart.entity.QuotationHasProduct;
import com.ereamart.entity.User;

@RestController
public class QuotationController {

	@Autowired
	private QuotationDao quotationDao;

	@Autowired // genarate instance of user dao - interface
    private UserDao userDao;

	@Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

	@Autowired // genarate instance of Order status dao
	private QuotationStatusDao quotationStatusDao;

    // mapping for return quotation html page
    @RequestMapping(value =  {"/quotation","/quotation.html"})
    public ModelAndView uiEmployeePage(){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());

		ModelAndView quotationPage = new ModelAndView();
		quotationPage.setViewName("quotation.html");
		quotationPage.addObject("loggedusername", auth.getName());
		quotationPage.addObject("loggeduserphoto", loggedUser.getUserphoto());
		return quotationPage;
	} 

	//request mapping for load quotation all data - /quotation/alldata
    @GetMapping(value = "/quotation/alldata", produces = "application/json")
    public List<Quotation> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Quotation");

        if (userPrivilege.getPrivi_select()) {
            return quotationDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
        
    }

	// mapping for insert quotation data
	@PostMapping(value = "/quotation/insert")
	public String saveUserData(@RequestBody Quotation quotation) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Quotation");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
	
			try {
				// set auto added data
				quotation.setAdded_datetime(LocalDateTime.now());
				quotation.setAdded_user_id(loggedUser.getId());
				quotation.setQuotation_code(quotationDao.getNextCode());

				// save oparator
				for (QuotationHasProduct qhp : quotation.getQuotationHasProductList()) { //due to block inner form 
					qhp.setQuotation_id(quotation);
				}
				quotationDao.save(quotation);

				// dependances
				
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	} 

	// mapping for update quotation data
	@PutMapping(value = "/quotation/update")
	public String updateUserData(@RequestBody Quotation quotation) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Quotation");
		
		if (userPrivilege.getPrivi_update()) {

			//check ext pk - update / delete only
			if (quotation.getId() == null) { // no employee id - with link access
				return "Update not completed, quotation already exists" ;
			}

			//duplicate check
			//email

			try {
				// set auto added data
				quotation.setUpdate_datetime(LocalDateTime.now());
				quotation.setUpdate_user_id(loggedUser.getId());

				// update oparator
				for (QuotationHasProduct qhp : quotation.getQuotationHasProductList()) { //due to block inner form 
					qhp.setQuotation_id(quotation);
				}
				quotationDao.save(quotation);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		}else {
			return "Update not completed, No Permission!";
		}
	
	}

	// mapping for delete product data
	@DeleteMapping(value = "/quotation/delete") 
	public String deleteEmployeeData(@RequestBody Quotation quotation) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Quotation");
        

		//check ext pk - update / delete only
		if (quotation.getId() == null) { // no employee id - with link access
			return "Delete not completed, quotation not exist" ;
		}
		Quotation extProductById = quotationDao.getReferenceById(quotation.getId()); // check id with db
		if (extProductById == null) {
			return "Delete not completed, quotation not exist in the database" ;
		}
		 
		try {
			// set auto added data
			extProductById.setDelete_datetime(LocalDateTime.now());
			extProductById.setDelete_user_id(userDao.getByUsename(auth.getName()).getId());
			extProductById.setQuotation_status_id(quotationStatusDao.getReferenceById(2));

			// delete oparator
			quotationDao.save(extProductById);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Delete not completed" + e.getMessage();
		}
	}

}
