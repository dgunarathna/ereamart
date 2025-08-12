package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.InvoiceStatus;

public interface InvoiceStatusDao extends JpaRepository<InvoiceStatus, Integer>{

}
