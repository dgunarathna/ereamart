package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.Customer;

public interface CustomerDao extends JpaRepository<Customer, Integer>{

}
