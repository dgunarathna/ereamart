package com.ereamart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.ereamart.dao.PrivilegeDao;
import com.ereamart.entity.Privilege;

@RestController
public class UserPrivilegeController {

    @Autowired
    private PrivilegeDao privilegeDao; 

    //define function for get privilege by given username and modulename
    public Privilege getPrivilegeByUserModule(String username, String modulename){

        Privilege userPrivilege = new Privilege();

        if (username.equalsIgnoreCase("admin")) {
            userPrivilege.setPrivi_select(true);
            userPrivilege.setPrivi_insert(true);
            userPrivilege.setPrivi_update(true);
            userPrivilege.setPrivi_delete(true);
        } else {
            String userPriString = privilegeDao.getUserPrivilegeByuserModule(username, modulename);
            String[] userPriviArray = userPriString.split(",");
            System.out.println(username + " - " + modulename + " - " + userPriString);

            userPrivilege.setPrivi_select(userPriviArray[0].equals("1"));
            userPrivilege.setPrivi_insert(userPriviArray[1].equals("1"));
            userPrivilege.setPrivi_update(userPriviArray[2].equals("1"));
            userPrivilege.setPrivi_delete(userPriviArray[3].equals("1"));
        }
        return userPrivilege;
    };

}
