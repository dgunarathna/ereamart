package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.Quotation;

public interface QuotationDao extends JpaRepository<Quotation, Integer>{

}
