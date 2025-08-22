package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.ProductItem;

public interface ProductItemDao extends JpaRepository<ProductItem, Integer>{

}
