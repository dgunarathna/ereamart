package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Respond;

public interface RespondDao extends JpaRepository<Respond, Integer>{

    @Query(value = "SELECT CONCAT('R', COALESCE(MAX(CAST(SUBSTRING(r.respond_code, 2) AS UNSIGNED)) + 1, 1)) FROM ereamart.respond as r;", nativeQuery = true)
    String getNextCode();



}
