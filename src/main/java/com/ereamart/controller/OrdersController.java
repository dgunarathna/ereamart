package com.ereamart.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.OrdersDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Orders;
import com.ereamart.entity.OrdersHasProduct;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.User;

@RestController
public class OrdersController {

	@Autowired
	private OrdersDao ordersDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private UserPrivilegeController userPrivilegeController;

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

	// mapping for orders privilege data
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


}
