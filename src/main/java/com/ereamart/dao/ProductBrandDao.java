package com.ereamart.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.ProductBrand;

public interface ProductBrandDao extends JpaRepository<ProductBrand, Integer>{

    //get brands by category
    // @Query("SELECT b FROM ProductBrand b WHERE b.id IN (SELECT bhc.productbrand_id.id FROM ProductBrandHasProductDepartment bhc WHERE bhc.productdepartment_id.id=?1)")
    // public List<ProductBrand> findPBrandybyPCategory(Integer categoryid);
}
