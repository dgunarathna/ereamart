package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Customer;
import com.ereamart.entity.Product;

public interface CustomerDao extends JpaRepository<Customer, Integer>{

    @Query(value = "Select c from Customer c where c.name=?1") 
    Product getByName(Integer name);
}
