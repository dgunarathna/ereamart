package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.Product;

public interface ProductDao extends JpaRepository<Product, Integer>{

}
