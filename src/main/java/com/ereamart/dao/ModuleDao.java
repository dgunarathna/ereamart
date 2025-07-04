package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.Module;

public interface ModuleDao  extends JpaRepository<Module, Integer>{

}
