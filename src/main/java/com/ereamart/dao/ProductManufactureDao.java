package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.ProductManufacture;

public interface ProductManufactureDao extends JpaRepository<ProductManufacture, Integer>{

    // get productmanufacture by name
    @Query(value = "Select p from ProductManufacture p where p.name=?1")
    public ProductManufacture getByName(String name);


}
