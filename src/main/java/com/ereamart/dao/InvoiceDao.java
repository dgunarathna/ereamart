package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Invoice;
import com.ereamart.entity.Product;

public interface InvoiceDao extends JpaRepository<Invoice, Integer>{

    @Query(value = "Select i from Invoice i where i.invoice_code=?1") 
    Product getByName(String name);

    //for get next code when new product
    @Query(value = "SELECT CONCAT('I', COALESCE(MAX(CAST(SUBSTRING(i.invoice_code, 2) AS UNSIGNED)) + 1, 1)) FROM ereamart.invoice as i;", nativeQuery = true)
    String getNextCode();
}
