package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Customer;
import com.ereamart.entity.Product;

public interface CustomerDao extends JpaRepository<Customer, Integer>{

    @Query(value = "Select c from Customer c where c.fullname=?1") 
    Product getByName(Integer name);

    @Query(value = "SELECT coalesce(CONCAT('C', (SUBSTRING(MAX(c.regno), 2) + 1)), 'C1') FROM ereamart.customer as c;", nativeQuery = true)
    String getNextRegNo();
}
