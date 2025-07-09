package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.ProductStatus;

public interface ProductStatusDao extends JpaRepository<ProductStatus, Integer>{

}
