package com.ereamart.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.ProductItem;

public interface ProductItemDao extends JpaRepository<ProductItem, Integer>{

    @Query(value = "SELECT pi.* FROM productitem pi  JOIN productbrand_has_productitem php ON pi.id = php.productitem_id  WHERE php.productbrand_id = ?1", nativeQuery = true)
    List<ProductItem> findProductItemByBrandID(Integer brandid);
}
