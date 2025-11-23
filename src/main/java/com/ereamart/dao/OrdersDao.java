package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Orders;

public interface OrdersDao extends JpaRepository<Orders, Integer>{

    @Query(value = "SELECT COALESCE(CONCAT('O', (SUBSTRING(MAX(o.orders_code), 2) + 1)), 'O1') FROM ereamart.orders as o", nativeQuery = true)
    String getNextOrderCode();
 
}
