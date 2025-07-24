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

import com.ereamart.dao.OrdersDao;
import com.ereamart.dao.OrdersStatusDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Orders;
import com.ereamart.entity.OrdersHasProduct;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.User;

@RestController
public class OrdersController {

	@Autowired // genarate instance of Orders dao
	private OrdersDao ordersDao;

	@Autowired // genarate instance of user dao
    private UserDao userDao;

	@Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

	@Autowired // genarate instance of Order status dao
	private OrdersStatusDao ordersStatusDao;

    // mapping for return order page
    @RequestMapping(value =  {"/orders","/orders.html"})
    public ModelAndView uiOrderPage(){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView orderPage = new ModelAndView();
		orderPage.setViewName("orders.html");
		orderPage.addObject("loggedusername", auth.getName());
		return orderPage;
	}

	//request mapping for load orders all data - /orders/alldata
    @GetMapping(value = "/orders/alldata", produces = "application/json")
    public List<Orders> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Orders");

        if (userPrivilege.getPrivi_select()) {
            return ordersDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
        
    }  

	// mapping for insert orders data
	@PostMapping(value = "/orders/insert")
	public String saveUserData(@RequestBody Orders orders) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Orders");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
	
			try {
				// set auto added data
				orders.setAdded_datetime(LocalDateTime.now());
				orders.setAdded_user_id(loggedUser.getId()); 
				orders.setOrders_code(ordersDao.getNextOrderCode());

				// save oparator
				for (OrdersHasProduct ohi : orders.getOrderHasProductList()) { //due to block inner form 
					ohi.setOrders_id(orders);
				}
				ordersDao.save(orders);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	}  

	// mapping for update orders data
	@PutMapping(value = "/orders/update")
	public String updateUserData(@RequestBody Orders orders) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Orders");
		
		if (userPrivilege.getPrivi_update()) {

			//check ext pk - update / delete only
			//duplicate check
			//email

			try {
				// set auto added data
				orders.setUpdate_datetime(LocalDateTime.now());
				orders.setUpdate_user_id(loggedUser.getId());

				// update oparator
				for (OrdersHasProduct ohi : orders.getOrderHasProductList()) { //due to block inner form 
					ohi.setOrders_id(orders);
				}
				ordersDao.save(orders);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		}else {
			return "Update not completed, No Permission!";
		}
	
	}

	// mapping for delete orders data
	@DeleteMapping(value = "/orders/delete") 
	public String deleteEmployeeData(@RequestBody Orders orders) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Orders");
        

		//check ext pk - update / delete only
		if (orders.getId() == null) { // no employee id - with link access
			return "Delete not completed, product not exist" ;
		}
		Orders extOrderById = ordersDao.getReferenceById(orders.getId()); // check id with db
		if (extOrderById == null) {
			return "Delete not completed, product not exist in the database" ;
		}
		 
		try {
			// set auto added data
			extOrderById.setDelete_datetime(LocalDateTime.now());
			extOrderById.setDelete_user_id(userDao.getByUsename(auth.getName()).getId());
			extOrderById.setOrders_status_id(ordersStatusDao.getReferenceById(2));

			// delete oparator
			for (OrdersHasProduct ohi : orders.getOrderHasProductList()) { //due to block inner form 
					ohi.setOrders_id(orders);
				}
			ordersDao.save(extOrderById);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Delete not completed" + e.getMessage();
		}
	}
}
