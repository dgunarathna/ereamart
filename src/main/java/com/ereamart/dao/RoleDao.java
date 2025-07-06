package com.ereamart.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Role;

public interface RoleDao  extends JpaRepository<Role, Integer>{

    @Query(value = "select r from Role r where r.name<>'Admin'")
    List<Role> findWithoutAdmin();

}
