package com.ereamart.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // this class genatate as an entity
@Table(name = "employee") //table mapping

@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment pk
    private Integer id; 

    @Column(name = "empno", unique = true)
    @Length(max = 8)
    @NotNull
    private String empno;

    @NotNull
    private String fullname;

    @NotNull
    private String email;

    @Column(name = "nic", unique = true)
    @NotNull
    @Length(max = 12, min = 10)
    private String nic;

    @NotNull
    private LocalDate dob;

    @NotNull
    private String gender;

    @NotNull
    @Length(max = 10)
    private String mobileno;

    @NotNull
    private String civilstatus;

    @NotNull
    private String address;
     
    private String note;

    @NotNull
    private LocalDateTime added_datetime;

    private LocalDateTime update_datetime;

    private LocalDateTime delete_datetime;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    @ManyToOne()
    @JoinColumn(name = "designation_id", referencedColumnName = "id")
    private Designation designation_id;

    @ManyToOne()
    @JoinColumn(name = "employeestatus_id", referencedColumnName = "id")
    private EmployeeStatus employeestatus_id;

}

