package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.InventoryStatus;

public interface InventoryStatusDao extends JpaRepository<InventoryStatus, Integer>{

}
