package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Employee;

public interface ReportDao extends JpaRepository<Employee, Integer>{

    //monthly
    @Query(value = "SELECT monthname(o.added_datetime), sum(o.total_amount) FROM ereamart.orders as o where date(o.added_datetime) between current_date() - interval 6 MONTH and current_date() group by monthname(o.added_datetime);", nativeQuery = true)
    String [] [] getPaymentsByMonth();

    //weekly
    @Query(value = "SELECT week(o.added_datetime), sum(o.total_amount) FROM ereamart.orders as o where date(o.added_datetime) between current_date() - interval 6 week and current_date() group by monthname(o.added_datetime);", nativeQuery = true)
    String [] [] getPaymentsByWeek();

    //daily
    @Query(value = "SELECT Day(o.added_datetime), sum(o.total_amount) FROM ereamart.orders as o where date(o.added_datetime) between current_date() - interval 6 Day and current_date() group by monthname(o.added_datetime);", nativeQuery = true)
    String [] [] getPaymentsByDay();
}
