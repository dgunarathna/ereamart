package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.ExpensesStatus;

public interface ExpensesStatusDao extends JpaRepository<ExpensesStatus, Integer>{

}
