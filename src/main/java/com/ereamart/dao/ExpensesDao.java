package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Expenses;
import com.ereamart.entity.Product;

public interface ExpensesDao extends JpaRepository<Expenses, Integer>{

    @Query(value = "Select e from Expenses e where e.bill_no=?1") 
    Product getByName(String name);

    @Query(value = "SELECT COALESCE(CONCAT('I', (SUBSTRING(MAX(e.bill_no), 2) + 1)), 'I1') FROM ereamart.expenses as e", nativeQuery = true)
    String getNextCode(); 
}
