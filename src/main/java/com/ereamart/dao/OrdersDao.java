package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Orders;

public interface OrdersDao extends JpaRepository<Orders, Integer>{

    @Query(value = "SELECT COALESCE(CONCAT('O', LPAD(SUBSTRING(MAX(o.orders_code), 3) + 1, 4, '0')), 'O0001') " + "FROM ereamart.orders as o", nativeQuery = true)
    String getNextOrderCode();
 
}
