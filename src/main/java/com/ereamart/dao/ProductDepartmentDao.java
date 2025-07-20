package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ereamart.entity.ProductDepartment;

public interface ProductDepartmentDao extends JpaRepository<ProductDepartment, Integer>{ 

    // @Query(value = "SELECT * FROM ereamart.productcategory as pd WHERE pd.productdepartment_id = 1", nativeQuery = true) 
    // public List<ProductDepartment> findDepartmentByCategory(Integer categoryid); 
   
    // @Query(value = "SELECT pd FROM ProductDepartment pd WHERE pd.productdepartment_id.id=1") 
    // public List<ProductDepartment> findDepartmentByCategory(Integer categoryid); 

    
}
