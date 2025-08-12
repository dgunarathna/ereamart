package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.CustomerStatus;

public interface CustomerStatusDao extends JpaRepository<CustomerStatus, Integer>{

}
