package com.ereamart.dao;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.OrdersHasProduct;

public interface OrdersHasProductDao extends JpaRepository<OrdersHasProduct, Integer>{

    @Query(value = "SELECT ohp.unitprice FROM ereamart.orders_has_product ohp WHERE ohp.orders_id = ?1 AND ohp.product_id = ?2", nativeQuery = true)
    BigDecimal  findUnitPriceByOrderAndProduct(Integer orderID, Integer productID);

    @Query(value = "SELECT ohp.quantity FROM ereamart.orders_has_product ohp WHERE ohp.orders_id = ?1 AND ohp.product_id = ?2", nativeQuery = true)
    BigDecimal findQTYByOrderAndProduct(Integer orderID, Integer productID);

    
}
