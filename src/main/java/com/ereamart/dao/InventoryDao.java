package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.Inventory;

public interface InventoryDao extends JpaRepository<Inventory, Integer>{

}
