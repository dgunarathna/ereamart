package com.ereamart.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Module;

public interface ModuleDao  extends JpaRepository<Module, Integer>{

    @Query(value = "SELECT m FROM Module m WHERE m.name NOT IN ('Privilege', 'Dashboard', 'Reports')")
    List<Module> modulesWithoutDPR();
}
