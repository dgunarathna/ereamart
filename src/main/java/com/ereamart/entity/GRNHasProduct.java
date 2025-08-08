package com.ereamart.entity;

import java.math.BigDecimal;
import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

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
@Table(name = "grn_has_product") //table mapping
@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor
@JsonInclude(value = Include.NON_NULL)

public class GRNHasProduct { 

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY) // auto increment pk
    private Integer id;

    @ManyToOne()
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    @JsonIgnore // block reading 
    private GRN grn_id;

    @NotNull
    private BigDecimal unitprice;

    @NotNull
    private Integer quantity;

    @NotNull
    private BigDecimal lineprice;

    @NotNull
    private Date expire_date;

    @NotNull
    private Date manufacture_date;

    @NotNull
    private String batch_number;

    @ManyToOne()
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product_id;




}
