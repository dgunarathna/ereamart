package com.ereamart.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // this class genatate as an entity
@Table(name = "income") //table mapping
@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor
@JsonInclude(value = Include.NON_NULL)

public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment pk
    private Integer id;

    private Integer income_number; 

    private Integer total_amount;

    private Integer paid_amount;

    private Integer balanced_amount;

    private Integer payment_methord;
    
    private Integer date;

    
    @NotNull
    private LocalDateTime added_datetime;

    private LocalDateTime update_datetime;

    private LocalDateTime delete_datetime;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;
}
