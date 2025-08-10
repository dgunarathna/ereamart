package com.ereamart.entity;

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
@Table(name = "quotation_has_product") //table mapping
@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor
@JsonInclude(value = Include.NON_NULL)

public class QuotationHasProduct { 

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY) // auto increment pk
    private Integer id;

    @ManyToOne()
    @JoinColumn(name = "quotation_id", referencedColumnName = "id")
    @JsonIgnore // block reading 
    private Quotation quotation_id;

    @NotNull
    private Integer quantity;

    @ManyToOne()
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product_id;




}
