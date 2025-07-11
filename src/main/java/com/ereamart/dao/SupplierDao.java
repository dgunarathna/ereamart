package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.Supplier;

public interface SupplierDao extends JpaRepository<Supplier, Integer>{

}
