package com.ereamart.dao;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.RespondHasProduct;

public interface RespondHasProductDao extends JpaRepository<RespondHasProduct, Integer>{

    @Query(value = "SELECT rhp.unitprice FROM ereamart.respond_has_product rhp WHERE rhp.respond_id = ?1 AND rhp.product_id = ?2", nativeQuery = true)
    BigDecimal  findUnitPriceByRespondAndProduct(Integer respondID, Integer productID);

    
}
