package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Customer;
import com.ereamart.entity.Product;

public interface CustomerDao extends JpaRepository<Customer, Integer>{

    @Query(value = "Select c from Customer c where c.fullname=?1") 
    Product getByName(Integer name);

    @Query(value = "SELECT coalesce(concat('C', lpad(substring(max(i.regno), 2) + 1, 5, 0)), 'C00001') FROM ereamart.customer as c;", nativeQuery = true)
    String getNextRegNo();
}
