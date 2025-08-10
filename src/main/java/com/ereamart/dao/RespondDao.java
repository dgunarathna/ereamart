package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Respond;

public interface RespondDao extends JpaRepository<Respond, Integer>{

    @Query(value = "SELECT coalesce(concat('R', lpad(substring(max(r.respond_code), 2) + 1, 5, 0)), 'R00001') FROM ereamart.respond as r;", nativeQuery = true)
    String getNextCode();


}
