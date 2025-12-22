package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Product;
import com.ereamart.entity.Quotation;

public interface QuotationDao extends JpaRepository<Quotation, Integer>{
    
    @Query(value = "Select q from Quotation q where q.quotation_code=?1") 
    Product getByCode(String name);

    //for get next code when new quotation
    @Query(value = "SELECT CONCAT('Q', COALESCE(MAX(CAST(SUBSTRING(q.quotation_code, 2) AS UNSIGNED)) + 1, 1)) FROM ereamart.quotation as q;", nativeQuery = true)
    String getNextCode();
}
