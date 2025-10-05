package com.ereamart.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.ereamart.entity.User;

public interface UserDao extends JpaRepository<User, Integer>{

    @Query(value = "select u from User u where u.username=?1")
    User getByUsename(String username);

    @Query(value = "SELECT u FROM User u WHERE u.username<> ?1 AND u.username<> 'Admin' ORDER BY u.id DESC")
    List<User> findAll(String username);

    @Query("SELECT u FROM User u WHERE u.email = ?1")
    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = ?1")
    User findById(String status);

}
