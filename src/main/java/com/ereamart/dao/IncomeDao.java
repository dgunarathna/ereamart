package com.ereamart.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Income;
import com.ereamart.entity.Invoice;

public interface IncomeDao extends JpaRepository<Income, Integer>{


    //for get next code when new product
    @Query(value = "SELECT coalesce(concat('I', lpad(substring(max(i.invoice_code), 2) + 1, 5, 0)), 'I00001') FROM ereamart.invoice as i;", nativeQuery = true)
    String getNextCode();

    // Find active income by invoice_id
    @Query("SELECT i FROM Income i WHERE i.invoice_id = :invoice AND i.delete_datetime IS NULL")
    Income findActiveByInvoice_id(Invoice invoice);
}
