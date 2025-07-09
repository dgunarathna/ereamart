package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.ProductDepartment;

public interface ProductDepartmentDao extends JpaRepository<ProductDepartment, Integer>{

}
