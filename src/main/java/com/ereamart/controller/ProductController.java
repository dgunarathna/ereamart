package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.ProductDao;
import com.ereamart.entity.Product;

@RestController
public class ProductController {

    @Autowired // genarate instance of product dao - interface
    private ProductDao productDao;

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
        return productDao.findAll();
    } 
}
