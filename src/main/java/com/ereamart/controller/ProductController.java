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

import com.ereamart.dao.ProductDao;
import com.ereamart.dao.ProductStatusDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.Product;
import com.ereamart.entity.User; 

@RestController
public class ProductController {

    @Autowired // genarate instance of product dao
    private ProductDao productDao;

    @Autowired // genarate instance of product status dao
    private ProductStatusDao productStatusDao;

    @Autowired // genarate instance of user dao
    private UserDao userDao;

    @Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

    // mapping for return product html page
    @RequestMapping(value =  {"/product","/product.html"})
    public ModelAndView uiProductPage(){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView productPage = new ModelAndView();
		productPage.setViewName("product.html");
		productPage.addObject("loggedusername", auth.getName());
		return productPage;
	} 

    //request mapping for load product all data - /product/alldata
    @GetMapping(value = "/product/alldata", produces = "application/json")
    public List<Product> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

        if (userPrivilege.getPrivi_select()) {
            return productDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    } 

	// mapping for insert product data
	@PostMapping(value = "/product/insert")
	public String saveUserData(@RequestBody Product product) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
			Product extProductName = productDao.getByName(product.getName());
			if (extProductName != null) {
				return "Save not completed, Product allready exist";
			}
	
			try {
				// set auto added data
				product.setAdded_datetime(LocalDateTime.now());
				product.setAdded_user_id(loggedUser.getId());
				product.setCode(productDao.getNextCode());

				// save oparator
				productDao.save(product);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	} 

	// mapping for update product data
	@PutMapping(value = "/product/update")
	public String updateUserData(@RequestBody Product product) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");
		
		if (userPrivilege.getPrivi_update()) {

			//check ext pk - update / delete only
			if (product.getId() == null) { // no employee id - with link access
				return "Update not completed, product already exists" ;
			}
			Product extById = productDao.getReferenceById(product.getId()); // check id with db
			if (extById == null) {
				return "Update not completed, product already exists" ;
			}  

			//duplicate check
			Product extProductByName = productDao.getByName(product.getName());
			if (extProductByName != null && extProductByName.getId() != product.getId()) {
				return "Update not completed, Product already exists" ;
			};

			//email

			try {
				// set auto added data
				product.setUpdate_datetime(LocalDateTime.now());
				product.setUpdate_user_id(loggedUser.getId());

				// update oparator
				productDao.save(product);

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
	@DeleteMapping(value = "/product/delete") 
	public String deleteEmployeeData(@RequestBody Product product) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");
        

		//check ext pk - update / delete only
		if (product.getId() == null) { // no employee id - with link access
			return "Delete not completed, product not exist" ;
		}
		Product extProductById = productDao.getReferenceById(product.getId()); // check id with db
		if (extProductById == null) {
			return "Delete not completed, product not exist in the database" ;
		}
		 
		try {
			// set auto added data
			extProductById.setDelete_datetime(LocalDateTime.now());
			extProductById.setDelete_user_id(userDao.getByUsename(auth.getName()).getId());
			extProductById.setProductstatus_id(productStatusDao.getReferenceById(2));

			// delete oparator
			productDao.save(extProductById);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Delete not completed" + e.getMessage();
		}
	}


	//  request mapping for load productbrand all data - /product/bysupplier
    @GetMapping(value = "/product/bysupplier/{supplierid}", produces = "application/json")
    public List<Product> findProductBySupplierID(@PathVariable("supplierid") Integer supplierid){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

			if (userPrivilege.getPrivi_select()) {
			return productDao.findProductBySupplier(supplierid);
			} else {
				return new ArrayList<>();
			}
    }

	//  request mapping for load productbrand all data - /product/byorderscode
    @GetMapping(value = "/product/byorderscode/{ordersid}", produces = "application/json")
    public List<Product> findProductByOrder(@PathVariable("ordersid") Integer ordersid){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

			if (userPrivilege.getPrivi_select()) {
			return productDao.findProductByOrdersCode(ordersid);
			} else {
				return new ArrayList<>();
			}
    }


	//  request mapping for load productbrand all data - /product/byorderscode
    @GetMapping(value = "/product/bygrncode/{grnid}", produces = "application/json")
    public List<Product> findProductByGRN(@PathVariable("grnid") Integer grnid){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

			if (userPrivilege.getPrivi_select()) {
			return productDao.findProductByGRNCode(grnid);
			} else {
				return new ArrayList<>();
			}
    }



	//  request mapping for load productbrand all data - /product/bysupplier
    @GetMapping(value = "/product/withoutsupply/{supplierid}", produces = "application/json")
    public List<Product> findProductWithoutSupplyID(@PathVariable("supplierid") Integer supplierid){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

			if (userPrivilege.getPrivi_select()) {
			return productDao.findProductWithoutSupply(supplierid);
			} else {
				return new ArrayList<>();
			}
    }

	

}
