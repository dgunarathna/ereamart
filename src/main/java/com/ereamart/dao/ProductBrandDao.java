package com.ereamart.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.ProductBrand;

public interface ProductBrandDao extends JpaRepository<ProductBrand, Integer>{

    @Query(value = "SELECT * FROM ereamart.productbrand where productmanufacture_id = ?1", nativeQuery = true)
    List<ProductBrand> findBrnadbyManufacture(Integer manufactureid);

 
}
