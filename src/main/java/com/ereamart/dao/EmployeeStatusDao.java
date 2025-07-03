package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.EmployeeStatus;

public interface EmployeeStatusDao extends JpaRepository<EmployeeStatus, Integer>{

}
