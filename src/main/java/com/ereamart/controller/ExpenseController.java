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

import com.ereamart.dao.ExpensesDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Expenses;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.Product;
import com.ereamart.entity.User;

@RestController
public class ExpenseController {

    @Autowired // genarate instance of expense dao - interface
    private ExpensesDao expensesDao;
    
    @Autowired // genarate instance of user dao - interface
    private UserDao userDao;

    @Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

    // mapping for return expense page
    @RequestMapping(value =  {"/expense","/expense.html"})
    public ModelAndView uiexpensePage(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView expensePage = new ModelAndView();
        expensePage.setViewName("expense.html");
		expensePage.addObject("loggedusername", auth.getName());
        return expensePage;
	}

    //request mapping for load Expenses all data - /product/alldata
    @GetMapping(value = "/expense/alldata", produces = "application/json")
    public List<Expenses> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Expenses");

        if (userPrivilege.getPrivi_select()) {
            return expensesDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
        
    }

    // mapping for insert Expenses data
	@PostMapping(value = "/Expenses/insert")
	public String saveUserData(@RequestBody Expenses expenses) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Expenses");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
	
			try {
				// set auto added data
				expenses.setAdded_datetime(LocalDateTime.now());
				expenses.setAdded_user_id(loggedUser.getId());

				// save oparator
				expensesDao.save(expenses);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	} 


    // mapping for update expenses data
	@PutMapping(value = "/expenses/update")
	public String updateUserData(@RequestBody Expenses expenses) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Expenses");
		
		if (userPrivilege.getPrivi_update()) {

			//check ext pk - update / delete only
			if (expenses.getId() == null) { // no employee id - with link access
				return "Update not completed, product already exists" ;
			}
			Expenses extById = expensesDao.getReferenceById(expenses.getId()); // check id with db
			if (extById == null) {
				return "Update not completed, product already exists" ;
			}  

			//duplicate check
			//email

			try {
				// set auto added data
				expenses.setUpdate_datetime(LocalDateTime.now());
				expenses.setUpdate_user_id(loggedUser.getId());

				// update oparator
				expensesDao.save(expenses);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		}else {
			return "Update not completed, No Permission!";
		}
	
	}

	// mapping for delete expenses data
	@DeleteMapping(value = "/expenses/delete") 
	public String deleteEmployeeData(@RequestBody Expenses expenses) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Expenses");
        

		//check ext pk - update / delete only
		if (expenses.getId() == null) { // no employee id - with link access
			return "Delete not completed, product not exist" ;
		}
		Expenses extProductById = expensesDao.getReferenceById(expenses.getId()); // check id with db
		if (extProductById == null) {
			return "Delete not completed, product not exist in the database" ;
		}
		 
		try {
			// set auto added data
			extProductById.setDelete_datetime(LocalDateTime.now());
			extProductById.setDelete_user_id(userDao.getByUsename(auth.getName()).getId());

			// delete oparator
			expensesDao.save(extProductById);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Delete not completed" + e.getMessage();
		}
	}

}
