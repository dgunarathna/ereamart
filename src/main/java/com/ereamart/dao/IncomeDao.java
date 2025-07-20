package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.Income;

public interface IncomeDao extends JpaRepository<Income, Integer>{

}
