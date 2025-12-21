package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Orders;

public interface OrdersDao extends JpaRepository<Orders, Integer>{

    @Query(value = "SELECT CONCAT('O', COALESCE(MAX(CAST(SUBSTRING(o.orders_code, 2) AS UNSIGNED)) + 1, 1)) FROM ereamart.orders as o;", nativeQuery = true)
    String getNextOrderCode();
 
}
