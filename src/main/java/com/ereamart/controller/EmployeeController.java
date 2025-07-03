package com.ereamart.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.EmployeeDao;
import com.ereamart.dao.EmployeeStatusDao;
import com.ereamart.entity.Employee;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

 
@RestController
public class EmployeeController {

	@Autowired
	private EmployeeDao employeeDao;

	@Autowired
	private EmployeeStatusDao employeeStatusDao;

    // mapping for return employee html page
    @RequestMapping(value =  {"/employee","/employee.html"})
    public ModelAndView uiEmployeePage(){
		ModelAndView employeePage = new ModelAndView();
		employeePage.setViewName("employee.html");
		return employeePage;
	} 
	
	// mapping for get employee all data 
	@GetMapping(value = "/employee/alldata", produces = "application/json")
	public List<Employee> findAllData() {
		return employeeDao.findAll(Sort.by(Direction.DESC, "id"));
	}
	
	// mapping for insert employee data
	@PostMapping(value = "/employe/insert")
	public String saveEmployeeData(@RequestBody Employee employee) {
		//check logged user authorization

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
			employee.setAdded_user_id(1);
			employee.setEmpno(employeeDao.getNextEmpNo());

			// save oparator
			employeeDao.save(employee);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Save not completed" + e.getMessage();
		}
	}  

	// mapping for update employee data
	@PutMapping(value = "/employee/update")
	public String updateEmployeeData(@RequestBody Employee employee) {
		//check logged user authorization

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
			employee.setUpdate_user_id(1);

			// update oparator
			employeeDao.save(employee);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Update not completed" + e.getMessage();
		}
	}
	 
	// mapping for delete employee data
	@DeleteMapping(value = "/employee/delete") 
	public String deleteEmployeeData(@RequestBody Employee employee) {
		//check logged user authorization

		//check ext pk - update / delete only
		if (employee.getId() == null) { // no employee id - with link access
			return "Delete not completed, NIC already exists" ;
		}
		Employee extEmployeeById = employeeDao.getReferenceById(employee.getId()); // check id with db
		if (extEmployeeById == null) {
			return "Delete not completed, NIC already exists" ;
		}

		//duplicate check 
		 
		try {
			// set auto added data
			extEmployeeById.setDelete_datetime(LocalDateTime.now());
			extEmployeeById.setDelete_user_id(1);
			extEmployeeById.setEmployeestatus_id(employeeStatusDao.getReferenceById(3));

			// delete oparator
			employeeDao.save(extEmployeeById);

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Delete not completed" + e.getMessage();
		}
	}
}

  


