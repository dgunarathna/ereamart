package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Privilege;

public interface PrivilegeDao extends JpaRepository<Privilege, Integer>{

    @Query(value = "select p from Privilege p where p.role_id.id=?1 and p.module_id.id=?2")
    Privilege getPrivilegeByRoleModule(Integer roleid, Integer moduleid);

    @Query(value = "SELECT bit_or(p.privi_select) as sel, bit_or(p.privi_insert) as inst, bit_or(p.privi_update) as upd, bit_or(p.privi_delete) as del FROM ereamart.privilege as p where p.module_id in (select m.id from ereamart.module as m where m.name=?2) and p.role_id in (select uhr.role_id from ereamart.user_has_role as uhr where uhr.user_id in (select u.id from ereamart.user as u where u.username=?1));", nativeQuery=true)
    String getUserPrivilegeByuserModule(String username, String modulename);

}
