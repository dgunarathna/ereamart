package com.ereamart.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.ProductManufactureDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.Product;
import com.ereamart.entity.ProductManufacture;
import com.ereamart.entity.User;

@RestController
public class ProductManufactureControlller {

    @Autowired // genarate instance of productmanufacture dao - interface
    private ProductManufactureDao productManufactureDao;

    @Autowired // genarate instance of user dao
    private UserDao userDao;

    @Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

    //request mapping for load productmanufacture all data - /productmanufacture/alldata
    @GetMapping(value = "/productmanufacture/alldata", produces = "application/json")
    public List<ProductManufacture> findAllData(){
        return productManufactureDao.findAll();
    } 


    // mapping for insert productManufacture data
	@PostMapping(value = "/productmanufacture/insert")
	public String saveUserData(@RequestBody ProductManufacture productManufacture) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
			ProductManufacture extProductName = productManufactureDao.getByName(productManufacture.getName());
			if (extProductName != null) {
				return "Save not completed, Manufacture allready exist";
			}
	
			try {
				// set auto added data
				productManufacture.setAdded_datetime(LocalDateTime.now());
				productManufacture.setAdded_user_id(loggedUser.getId());

				// save oparator
				productManufactureDao.save(productManufacture);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	} 
}
