package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.Designation;

public interface DesignationDao  extends JpaRepository<Designation, Integer>{

}
