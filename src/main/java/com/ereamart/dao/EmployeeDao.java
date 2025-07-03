package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Employee;

public interface EmployeeDao  extends JpaRepository<Employee, Integer>{

    @Query(value = "SELECT lpad(max(e.empno) + 1, 8, 0) FROM ereamart.employee as e;", nativeQuery = true)
    String getNextEmpNo();

    @Query(value = "select e from Employee e where e.nic=?1")
    Employee getByNIC(String nic);

    @Query(value = "select e from Employee e where e.email=?1")
    Employee getByEmail(String email);
} 
