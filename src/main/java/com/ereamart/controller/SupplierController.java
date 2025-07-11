package com.ereamart.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.SupplierDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.Supplier;

@RestController
public class SupplierController {

    @Autowired
    private SupplierDao supplierDao;

    @Autowired // genarate instance of user dao - interface
    private UserDao userDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    // mapping for return supplier page
    @RequestMapping(value =  {"/supplier","/supplier.html"})
    public ModelAndView uiSupplierPage(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView supplierPage = new ModelAndView();
        supplierPage.setViewName("supplier.html");
		supplierPage.addObject("loggedusername", auth.getName());
        return supplierPage;
	}

    //request mapping for load supplier all data - /supplier/alldata
    @GetMapping(value = "/supplier/alldata", produces = "application/json")
    public List<Supplier> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (userPrivilege.getPrivi_select()) {
            return supplierDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
        
    } 

    // mapping for insert supplier data
	// @PostMapping(value = "/supplier/insert")
	// public String saveUserData(@RequestBody Supplier supplier) {

	// 	//check logged user authorization
	// 	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	// 	User loggedUser = userDao.geByUsename(auth.getName());
	// 	Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

	// 	if (userPrivilege.getPrivi_insert()) {
	// 		//duplicate check
	// 		Supplier extSupplierName = supplierDao.getByName(supplier.getName());
	// 		if (extSupplierName != null) {
	// 			return "Save not completed, supplier allready exist";
	// 		}
	
	// 		try {
	// 			// set auto added data
	// 			product.setAdded_datetime(LocalDateTime.now());
	// 			product.setAdded_user_id(loggedUser.getId());
	// 			product.setCode(productDao.getNextCode());

	// 			// save oparator
	// 			productDao.save(product);

	// 			// dependances
	// 			return "OK";
	// 		} catch (Exception e) {
	// 			return "Save not completed" + e.getMessage();
	// 		}
	// 	} else {
	// 		return "Save not completed, No Permission!";
	// 	}


	// } 

}
