package com.ereamart.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.EmployeeDao;
import com.ereamart.dao.EmployeeStatusDao;
import com.ereamart.dao.RoleDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Employee;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.Role;
import com.ereamart.entity.User;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

 
@RestController
public class EmployeeController {

	@Autowired
	private EmployeeDao employeeDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private EmployeeStatusDao employeeStatusDao;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private UserPrivilegeController userPrivilegeController;

    // mapping for return employee html page
    @RequestMapping(value =  {"/employee","/employee.html"})
    public ModelAndView uiEmployeePage(){

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView employeePage = new ModelAndView();
		employeePage.setViewName("employee.html");
		employeePage.addObject("loggedusername", auth.getName());
		return employeePage;
	} 
	
	// mapping for get employee all data 
	@GetMapping(value = "/employee/alldata", produces = "application/json")
	public List<Employee> findAllData() {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");

		if (userPrivilege.getPrivi_select()) {
            return employeeDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
	}
	
	// mapping for get employee all data 
	@GetMapping(value = "/employee/withoutuseraccount", produces = "application/json")
	public List<Employee> findWithoutUserAccount() {
		return employeeDao.findWithoutUserAccount();
	}
	
	// mapping for insert employee data
	@PostMapping(value = "/employe/insert")
	public String saveEmployeeData(@RequestBody Employee employee) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");
		User loggedUser = userDao.getByUsename(auth.getName());

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
			Employee extEmployeeByNic = employeeDao.getByNIC(employee.getNic());
			if (extEmployeeByNic != null) {
				return "Save not completed, NIC already exists" ;
			};

			Employee extEmployeeByEmail = employeeDao.getByEmail(employee.getEmail());
			if (extEmployeeByEmail != null) {
				return "Save not completed, Email already exists" ;
			};

			try {
				// set auto added data
				employee.setAdded_datetime(LocalDateTime.now());
				employee.setAdded_user_id(loggedUser.getId());
				employee.setEmpno(employeeDao.getNextEmpNo());

				// save oparator
				employeeDao.save(employee);

				// dependances

				if (employee.getDesignation_id().getUseraccount()) {
					User user = new User();
					user.setUsername(employee.getDesignation_id().getName()); 
					if (employee.getEmpphoto() != null) {
						user.setUserphoto(employee.getEmpphoto());
					}
					user.setEmail(employee.getEmail());
					user.setStatus(true);
					user.setAdded_datetime(LocalDateTime.now());
					user.setPassword(bCryptPasswordEncoder.encode(employee.getDesignation_id().getName()));
					user.setEmployee_id(employeeDao.getByNIC(employee.getNic()));

					Set<Role> roles = new HashSet<>();
					Role role = roleDao.getReferenceById(employee.getDesignation_id().getRoleid());
					roles.add(role);

					user.setRoles(roles); 
					
					userDao.save(user);
				}

				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}

		
	}  

	// mapping for update employee data
	@PutMapping(value = "/employee/update")
	public String updateEmployeeData(@RequestBody Employee employee) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");
		User loggedUser = userDao.getByUsename(auth.getName());

		if (userPrivilege.getPrivi_update()) {
			//check ext pk - update / delete only
			if (employee.getId() == null) { // no employee id - with link access
				return "Update not completed, NIC already exists" ;
			}
			Employee extById = employeeDao.getReferenceById(employee.getId()); // check id with db
			if (extById == null) {
				return "Update not completed, NIC already exists" ;
			}   
 
			//duplicate check
			Employee extEmployeeByNic = employeeDao.getByNIC(employee.getNic());
			if (extEmployeeByNic != null && extEmployeeByNic.getId() != employee.getId()) {
				return "Update not completed, NIC already exists" ;
			};

			Employee extEmployeeByEmail = employeeDao.getByEmail(employee.getEmail());
			if (extEmployeeByEmail != null && extEmployeeByEmail.getId() != employee.getId()) {
				return "Update not completed, Email already exists" ;
			};

			try {
				// set auto added data
				employee.setUpdate_datetime(LocalDateTime.now());
				employee.setUpdate_user_id(loggedUser.getId());

				// update oparator
				employeeDao.save(employee);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		}else {
			return "Update not completed, No Permission!";
		}

		
	}
	 
	// mapping for delete employee data
	@DeleteMapping(value = "/employee/delete") 
	public String deleteEmployeeData(@RequestBody Employee employee) {
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");
		User loggedUser = userDao.getByUsename(auth.getName());

		if (userPrivilege.getPrivi_delete()) {
			//check ext pk - update / delete only
			if (employee.getId() == null) { // no employee id - with link access
				return "Delete not completed, Employee not exist" ;
			}
			Employee extEmployeeById = employeeDao.getReferenceById(employee.getId()); // check id with db
			if (extEmployeeById == null) {
				return "Delete not completed, Employee not exist in the database" ;
			}
			try {
				// set auto added data
				extEmployeeById.setDelete_datetime(LocalDateTime.now());
				extEmployeeById.setDelete_user_id(loggedUser.getId());
				extEmployeeById.setEmployeestatus_id(employeeStatusDao.getReferenceById(3));

				// delete oparator
				employeeDao.save(extEmployeeById);

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Delete not completed" + e.getMessage();
			}
		} else {
			return "Delete not completed, No Permission!";
		}
	}	
}

  


