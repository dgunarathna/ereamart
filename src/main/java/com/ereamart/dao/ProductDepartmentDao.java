package com.ereamart.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.ProductDepartment;

public interface ProductDepartmentDao extends JpaRepository<ProductDepartment, Integer>{

    // @Query(value = "SELECT pd FROM ProductCategory pd where pd.productcategory_id.id=?1") 
    // public List<ProductDepartment> findDepartmentByCategory(Integer categoryid);  

}
