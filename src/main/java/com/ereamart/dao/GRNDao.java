package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.GRN;
import com.ereamart.entity.Product;

public interface GRNDao extends JpaRepository<GRN, Integer>{

    @Query(value = "Select grn from GRN grn where grn.grn_no=?1") 
    Product getByName(String name);

    @Query(value = "SELECT COALESCE(CONCAT('GRN', LPAD(SUBSTRING(MAX(grn.grn_no), 3) + 1, 4, '0')), 'GRN0001') FROM ereamart.grn as grn", nativeQuery = true)
    String getNextOrderCode();

}
