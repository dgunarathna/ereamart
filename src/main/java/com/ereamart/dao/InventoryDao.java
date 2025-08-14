package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Inventory;
import com.ereamart.entity.Product;

public interface InventoryDao extends JpaRepository<Inventory, Integer>{

    @Query(value = "Select i from Inventory i where i.batch_number=?1") 
    Product getByName(String name);

    //for get next code
    @Query(value = "SELECT coalesce(concat('I', lpad(substring(max(i.inventory_code), 2) + 1, 5, 0)), 'I00001') FROM ereamart.inventory as i;", nativeQuery = true)
    String getNextCode();
}
