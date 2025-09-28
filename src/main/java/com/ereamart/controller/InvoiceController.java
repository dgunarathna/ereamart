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

import com.ereamart.dao.InvoiceDao;
import com.ereamart.dao.InvoiceStatusDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Invoice;
import com.ereamart.entity.InvoiceHasProduct;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.User;

@RestController
public class InvoiceController {

	@Autowired // genarate instance of user dao - interface
    private InvoiceDao invoiceDao;

	@Autowired // genarate instance of user dao - interface
    private InvoiceStatusDao invoiceStatusDao;

	@Autowired // genarate instance of user dao - interface
    private UserDao userDao;

	@Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

    // mapping for return invoice page
    @RequestMapping(value =  {"/invoice","/invoice.html"})
    public ModelAndView uiInvoicePage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	User loggedUser = userDao.getByUsename(auth.getName());

	ModelAndView invoicePage = new ModelAndView();   
	invoicePage.setViewName("invoice.html");
	invoicePage.addObject("loggedusername", auth.getName());
	invoicePage.addObject("loggeduserphoto", loggedUser.getUserphoto());

	return invoicePage;
	}

	//request mapping for load invoice all data - /invoice/alldata
    @GetMapping(value = "/invoice/alldata", produces = "application/json")
    public List<Invoice> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Invoice");

        if (userPrivilege.getPrivi_select()) {
            return invoiceDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
        
    }

    // mapping for insert invoice data
	@PostMapping(value = "/invoice/insert")
	public String saveUserData(@RequestBody Invoice invoice) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Invoice");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
	
			try {
				// set auto added data
				invoice.setAdded_datetime(LocalDateTime.now());
				invoice.setAdded_user_id(loggedUser.getId());
				invoice.setInvoice_code(invoiceDao.getNextCode());

				// save oparator
				for (InvoiceHasProduct ihp : invoice.getInvoiceHasProductList()) { //due to block inner form 
					ihp.setInvoice_id(invoice);
				}
				invoiceDao.save(invoice);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	} 

    // mapping for invoice data
	@PutMapping(value = "/invoice/update")
	public String updateUserData(@RequestBody Invoice invoice) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");
		
		if (userPrivilege.getPrivi_update()) {

			//check ext pk - update / delete only
			if (invoice.getId() == null) { // no employee id - with link access
				return "Update not completed, product already exists" ;
			}
			Invoice extById = invoiceDao.getReferenceById(invoice.getId()); // check id with db
			if (extById == null) {
				return "Update not completed, product already exists" ;
			}  

			//duplicate check
			//email

			try {
				// set auto added data
				invoice.setUpdate_datetime(LocalDateTime.now());
				invoice.setUpdate_user_id(loggedUser.getId());

				// update oparator
				for (InvoiceHasProduct ihp : invoice.getInvoiceHasProductList()) { //due to block inner form 
					ihp.setInvoice_id(invoice);
				}
				invoiceDao.save(invoice);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		}else {
			return "Update not completed, No Permission!";
		}
	
	}

	// mapping for delete invoice data
	@DeleteMapping(value = "/invoice/delete") 
	public String deleteEmployeeData(@RequestBody Invoice invoice) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Invoice");
        

		//check ext pk - update / delete only
		if (invoice.getId() == null) { // no employee id - with link access
			return "Delete not completed, product not exist" ;
		}
		Invoice extProductById = invoiceDao.getReferenceById(invoice.getId()); // check id with db
		if (extProductById == null) {
			return "Delete not completed, product not exist in the database" ;
		}
		 
		try {
			// set auto added data
			extProductById.setDelete_datetime(LocalDateTime.now());
			extProductById.setDelete_user_id(userDao.getByUsename(auth.getName()).getId());
			extProductById.setInvoice_status_id(invoiceStatusDao.getReferenceById(2));

			// delete oparator
			invoiceDao.save(extProductById);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Delete not completed" + e.getMessage();
		}
	}
}
