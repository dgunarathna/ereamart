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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.InventoryDao;
import com.ereamart.dao.InventoryStatusDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Inventory;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.User;

@RestController
public class InventoryController {

	@Autowired // genarate instance of user dao - interface
    private InventoryDao inventoryDao;

	@Autowired // genarate instance of user dao - interface
    private InventoryStatusDao inventoryStatusDao;

	@Autowired // genarate instance of user dao - interface
    private UserDao userDao;

	@Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;


    // mapping for return inventory page
    @RequestMapping(value =  {"/inventory","/inventory.html"})
    public ModelAndView uiInventoryPage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();

	ModelAndView inventoryPage = new ModelAndView();   
	inventoryPage.setViewName("inventory.html");
	inventoryPage.addObject("loggedusername", auth.getName());

	return inventoryPage;
	}

	//request mapping for load inventory all data - /inventory/alldata
    @GetMapping(value = "/inventory/alldata", produces = "application/json")
    public List<Inventory> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Inventory");

        if (userPrivilege.getPrivi_select()) {
            return inventoryDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
        
    }

    // mapping for insert inventory data
	@PostMapping(value = "/inventory/insert")
	public String saveUserData(@RequestBody Inventory inventory) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Inventory");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
	
			try {
				// set auto added data
				inventory.setAdded_datetime(LocalDateTime.now());
				inventory.setAdded_user_id(loggedUser.getId());
				inventory.setInventory_code(inventoryDao.getNextCode());

				// save oparator
				inventoryDao.save(inventory);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	} 

    // mapping for inventory  data
	@PutMapping(value = "/inventory/update")
	public String updateUserData(@RequestBody Inventory inventory) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Inventory");
		
		if (userPrivilege.getPrivi_update()) {

			//check ext pk - update / delete only
			if (inventory.getId() == null) { // no employee id - with link access
				return "Update not completed, product already exists" ;
			}
			Inventory extById = inventoryDao.getReferenceById(inventory.getId()); // check id with db
			if (extById == null) {
				return "Update not completed, product already exists" ;
			}  

			//duplicate check
			//email

			try {
				// set auto added data
				inventory.setUpdate_datetime(LocalDateTime.now());
				inventory.setUpdate_user_id(loggedUser.getId());

				// update oparator
				inventoryDao.save(inventory);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		}else {
			return "Update not completed, No Permission!";
		}
	
	}

	// mapping for delete inventory data
	@DeleteMapping(value = "/inventory/delete") 
	public String deleteEmployeeData(@RequestBody Inventory inventory) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Inventory");
        

		//check ext pk - update / delete only
		if (inventory.getId() == null) { // no employee id - with link access
			return "Delete not completed, product not exist" ;
		}
		Inventory extProductById = inventoryDao.getReferenceById(inventory.getId()); // check id with db
		if (extProductById == null) {
			return "Delete not completed, product not exist in the database" ;
		}
		 
		try {
			// set auto added data
			extProductById.setDelete_datetime(LocalDateTime.now());
			extProductById.setDelete_user_id(userDao.getByUsename(auth.getName()).getId());
			extProductById.setInventory_status_id(inventoryStatusDao.getReferenceById(2));

			// delete oparator
			inventoryDao.save(extProductById);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Delete not completed" + e.getMessage();
		}
	}


	//  request mapping for roq - /qty/byinventory/2
    @GetMapping(value = "/qty/byinventory/{productid}", produces = "application/json")
    public Integer findQTYByInventory(@PathVariable("productid") Integer productid){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Inventory");

			if (userPrivilege.getPrivi_select()) {
			return inventoryDao.findQTYByInventory(productid);
			} else {
				return null;
			}
    }

}
