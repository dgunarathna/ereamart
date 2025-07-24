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

import com.ereamart.dao.CustomerDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Customer;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.Product;
import com.ereamart.entity.User;

@RestController
public class CustomerController {

	@Autowired // genarate instance of customer dao - interface
    private CustomerDao customerDao;

	@Autowired // genarate instance of user dao - interface
    private UserDao userDao;

	@Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

    // mapping for return customer page
    @RequestMapping(value =  {"/customer","/customer.html"})
    public ModelAndView uiCustomerPage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();

	ModelAndView customerPage = new ModelAndView();   
	customerPage.setViewName("customer.html");
	customerPage.addObject("loggedusername", auth.getName());

	return customerPage;
	}

	//request mapping for load customer all data - /customer/alldata
    @GetMapping(value = "/customer/alldata", produces = "application/json")
    public List<Customer> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

        if (userPrivilege.getPrivi_select()) {
            return customerDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
        
    }

    // mapping for insert customer data
	@PostMapping(value = "/customer/insert")
	public String saveUserData(@RequestBody Customer customer) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
	
			try {
				// set auto added data
				customer.setAdded_datetime(LocalDateTime.now());
				customer.setAdded_user_id(loggedUser.getId());

				// save oparator
				customerDao.save(customer);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	} 

    // mapping for customer data
	@PutMapping(value = "/customer/update")
	public String updateUserData(@RequestBody Customer customer) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");
		
		if (userPrivilege.getPrivi_update()) {

			//check ext pk - update / delete only
			if (customer.getId() == null) { // no employee id - with link access
				return "Update not completed, product already exists" ;
			}
			Customer extById = customerDao.getReferenceById(customer.getId()); // check id with db
			if (extById == null) {
				return "Update not completed, product already exists" ;
			}  

			//duplicate check
			//email

			try {
				// set auto added data
				customer.setUpdate_datetime(LocalDateTime.now());
				customer.setUpdate_user_id(loggedUser.getId());

				// update oparator
				customerDao.save(customer);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		}else {
			return "Update not completed, No Permission!";
		}
	
	}

	// mapping for delete customer data
	@DeleteMapping(value = "/customer/delete") 
	public String deleteEmployeeData(@RequestBody Customer customer) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");
        

		//check ext pk - update / delete only
		if (customer.getId() == null) { // no employee id - with link access
			return "Delete not completed, product not exist" ;
		}
		Customer extProductById = customerDao.getReferenceById(customer.getId()); // check id with db
		if (extProductById == null) {
			return "Delete not completed, product not exist in the database" ;
		}
		 
		try {
			// set auto added data
			extProductById.setDelete_datetime(LocalDateTime.now());
			extProductById.setDelete_user_id(userDao.getByUsename(auth.getName()).getId());

			// delete oparator
			customerDao.save(extProductById);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Delete not completed" + e.getMessage();
		}
	}
}
