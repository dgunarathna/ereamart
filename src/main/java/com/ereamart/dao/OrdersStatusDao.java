package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.OrdersStatus;

public interface OrdersStatusDao extends JpaRepository<OrdersStatus, Integer>{

}
