package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.ProductCategory;

public interface ProductCategoryDao extends JpaRepository<ProductCategory, Integer>{

}
