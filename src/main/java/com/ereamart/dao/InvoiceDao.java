package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.Invoice;

public interface InvoiceDao extends JpaRepository<Invoice, Integer>{

}
