package com.ereamart.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // this class genatate as an entity
@Table(name = "employeestatus") //table mapping

@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor
public class EmployeeStatus {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Integer id;
 
    private String name;
}
 
