package com.ereamart.dao;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.GRNHasProduct;

public interface GRNHasProductDao extends JpaRepository<GRNHasProduct, Integer>{

    @Query(value = "SELECT ghp.batch_number FROM ereamart.grn_has_product ghp WHERE ghp.grn_id = ?1 AND ghp.product_id = ?2", nativeQuery = true)
    String findBatchNoByGRNAndProduct(Integer grnID, Integer productID);

    @Query(value = "SELECT ghp.quantity FROM ereamart.grn_has_product ghp WHERE ghp.grn_id = ?1 AND ghp.product_id = ?2", nativeQuery = true)
    Integer findQtyByGRNAndProduct(Integer grnID, Integer productID);

    @Query(value = "SELECT ghp.unitprice FROM ereamart.grn_has_product ghp WHERE ghp.grn_id = ?1 AND ghp.product_id = ?2", nativeQuery = true)
    BigDecimal findPriceByGRNAndProduct(Integer grnID, Integer productID);

}
