package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Privilege;

public interface PrivilegeDao extends JpaRepository<Privilege, Integer>{

    @Query(value = "select p from Privilege p where p.role_id.id=?1 and p.module_id.id=?2")
    Privilege getPrivilegeByRoleModule(Integer roleid, Integer moduleid);

}
