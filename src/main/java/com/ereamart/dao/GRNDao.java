package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.GRN;
import com.ereamart.entity.Product;

public interface GRNDao extends JpaRepository<GRN, Integer>{

    @Query(value = "Select grn from GRN grn where grn.grn_no=?1") 
    Product getByName(String name);
}
