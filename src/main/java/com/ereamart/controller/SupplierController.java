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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.SupplierDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.Supplier;
import com.ereamart.entity.SupplierStatusDao;
import com.ereamart.entity.User;

@RestController
public class SupplierController {

    @Autowired // genarate instance of supplier dao
    private SupplierDao supplierDao;

    @Autowired // genarate instance of supplier dao
    private SupplierStatusDao supplierStatusDao;

    @Autowired // genarate instance of user dao
    private UserDao userDao;

    @Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;
    

    // mapping for return supplier page
    @RequestMapping(value =  {"/supplier","/supplier.html"})
    public ModelAndView uiSupplierPage(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());

        ModelAndView supplierPage = new ModelAndView();
        supplierPage.setViewName("supplier.html");
		supplierPage.addObject("loggedusername", auth.getName());
		supplierPage.addObject("pageTitle", "Supplier");
		supplierPage.addObject("loggeduserphoto", loggedUser.getUserphoto());
        return supplierPage;
	}

    //request mapping for load supplier all data - /supplier/alldata
    @GetMapping(value = "/supplier/alldata", produces = "application/json")
    public List<Supplier> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        if (userPrivilege.getPrivi_select()) {
            return supplierDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
        
    } 

    // mapping for insert supplier data
	@PostMapping(value = "/supplier/insert")
	public String saveUserData(@RequestBody Supplier supplier) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
	
			try {
				// set auto added data
				supplier.setAdded_datetime(LocalDateTime.now());
				supplier.setAdded_user_id(loggedUser.getId());
				supplier.setReg_no(supplierDao.getNextRegNo());

				// save oparator
				supplierDao.save(supplier);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	} 


    // mapping for supplier data
	@PutMapping(value = "/supplier/update")
	public String updateUserData(@RequestBody Supplier supplier) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");
		
		if (userPrivilege.getPrivi_update()) {

			//check ext pk - update / delete only
			if (supplier.getId() == null) { // no employee id - with link access
				return "Update not completed, product already exists" ;
			}
			Supplier extById = supplierDao.getReferenceById(supplier.getId()); // check id with db
			if (extById == null) {
				return "Update not completed, product already exists" ;
			}  

			//duplicate check
			//email

			try {
				// set auto added data
				supplier.setUpdate_datetime(LocalDateTime.now());
				supplier.setUpdate_user_id(loggedUser.getId());

				// update oparator
				supplierDao.save(supplier);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		}else {
			return "Update not completed, No Permission!";
		}
	
	}

	// mapping for delete supplier data
	@DeleteMapping(value = "/supplier/delete") 
	public String deleteEmployeeData(@RequestBody Supplier supplier) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");
        

		//check ext pk - update / delete only
		if (supplier.getId() == null) { // no employee id - with link access
			return "Delete not completed, product not exist" ;
		}
		Supplier extProductById = supplierDao.getReferenceById(supplier.getId()); // check id with db
		if (extProductById == null) {
			return "Delete not completed, product not exist in the database" ;
		}
		 
		try {
			// set auto added data
			extProductById.setDelete_datetime(LocalDateTime.now());
			extProductById.setDelete_user_id(userDao.getByUsename(auth.getName()).getId());
			extProductById.setSupplier_status_id(supplierStatusDao.getReferenceById(2));

			// delete oparator
			supplierDao.save(extProductById);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Delete not completed" + e.getMessage();
		}
	}


	//request mapping for load productdepartment all data - /reportpayment/bytime?startdate=2015-01-01&enddate=2025-08-01&type=Daily
    @GetMapping(value = "/supplier/getbyid", params = {"id"} , produces = "application/json")
    public Supplier getProductById(@RequestParam("id") Integer id){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");
        
        if (userPrivilege.getPrivi_select()) {
			return supplierDao.getReferenceById(id);
		} else {
			return new Supplier();
		}
    } 

}
