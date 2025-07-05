package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.User;

public interface UserDao extends JpaRepository<User, Integer>{

    @Query(value = "select u from User u where u.username=?1")
    User geByUsename(String username);

}
