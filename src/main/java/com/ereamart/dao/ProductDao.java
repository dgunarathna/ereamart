package com.ereamart.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Product;

public interface ProductDao extends JpaRepository<Product, Integer>{ 

    @Query(value = "Select p from Product p where p.name=?1") 
    Product getByName(String name);


    //for get next code when new product
    @Query(value = "SELECT coalesce(concat('P', lpad(substring(max(p.code), 2) + 1, 5, 0)), 'P00001') FROM ereamart.product as p;", nativeQuery = true)
    String getNextCode();


    @Query(value = "select p from Product p where p.id in (select shp.product_id.id from SupplierHasProduct shp where shp.supplier_id.id=?1)")
    List<Product> findProductBySupplier(Integer supplierid);

    

}
