package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.QuotationStatus;

public interface QuotationStatusDao extends JpaRepository<QuotationStatus, Integer>{

}
