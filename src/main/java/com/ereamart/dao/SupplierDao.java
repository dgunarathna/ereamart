package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Product;
import com.ereamart.entity.Supplier;

public interface SupplierDao extends JpaRepository<Supplier, Integer>{

    @Query(value = "Select s from Supplier s where s.name=?1") 
    Product getByName(String name);

    @Query(value = "SELECT coalesce(CONCAT('S', (SUBSTRING(MAX(s.reg_no), 2) + 1)), 'S1') FROM ereamart.supplier as s;", nativeQuery = true)
    String getNextRegNo();
}
