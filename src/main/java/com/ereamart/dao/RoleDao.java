package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ereamart.entity.Role;

public interface RoleDao  extends JpaRepository<Role, Integer>{

}
