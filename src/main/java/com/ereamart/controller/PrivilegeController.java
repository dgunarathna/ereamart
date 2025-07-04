package com.ereamart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.PrivilegeDao;
import com.ereamart.entity.Privilege; 

@RestController
public class PrivilegeController {

	@Autowired
	private PrivilegeDao privilegeDao;

    // mapping for return privilege page
    @RequestMapping(value =  {"/privilege","/privilege.html"})
    public ModelAndView uiPrivilegePage(){
	ModelAndView privilegePage = new ModelAndView();
	privilegePage.setViewName("privilege.html");
	return privilegePage;
	}

	// mapping for get privilege all data 
	@GetMapping(value = "/privilege/alldata", produces = "application/json")
	public List<Privilege> findAllData() {
		return privilegeDao.findAll(Sort.by(Direction.DESC, "id"));
	}
}