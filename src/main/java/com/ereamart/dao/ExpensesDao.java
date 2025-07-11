package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.Expenses;

public interface ExpensesDao extends JpaRepository<Expenses, Integer>{

}
