package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Employee;

public interface ReportDao extends JpaRepository<Employee, Integer>{

    //non cusromize reports
    //monthly
    @Query(value = "SELECT monthname(o.added_datetime), sum(o.total_amount) FROM ereamart.orders as o where date(o.added_datetime) between current_date() - interval 6 MONTH and current_date() group by monthname(o.added_datetime);", nativeQuery = true)
    String [] [] getPaymentsByMonthly();


    //custome reports
    //orders
    //Monthly
    @Query(value = "SELECT monthname(o.added_datetime), sum(o.total_amount) FROM ereamart.orders as o where date(o.added_datetime) between ?1 and ?2 group by monthname(o.added_datetime);", nativeQuery = true)
    String [] [] getPaymentsByMonth(String startdate, String enddate);

    //Weekly
    @Query(value = "SELECT week(o.added_datetime), sum(o.total_amount) FROM ereamart.orders as o where date(o.added_datetime) between ?1 and ?2 group by week(o.added_datetime);", nativeQuery = true)
    String [] [] getPaymentsByweek(String startdate, String enddate);

    //daily
    @Query(value = "SELECT day(o.added_datetime), sum(o.total_amount) FROM ereamart.orders as o where date(o.added_datetime) between ?1 and ?2 group by day(o.added_datetime);", nativeQuery = true)
    String [] [] getPaymentsByDay(String startdate, String enddate);
}
