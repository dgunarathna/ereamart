package com.ereamart.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.ProductCategory;

public interface ProductCategoryDao extends JpaRepository<ProductCategory, Integer>{

    @Query(value = "select pc from ProductCategory pc where pc.productdepartment_id.id=?1")
    List<ProductCategory> findCategoryByDepartment(Integer departmentid);
    
}
