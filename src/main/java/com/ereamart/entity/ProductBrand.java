package com.ereamart.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // this class genatate as an entity
@Table(name = "productbrand") //table mapping
@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor
@JsonInclude(value = Include.NON_NULL)

public class ProductBrand {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY) // auto increment pk
    private Integer id;
 
    private String name;

    @ManyToOne()
    @JoinColumn(name = "productmanufacture_id", referencedColumnName = "id")
    private ProductManufacture productmanufacture_id;
}
 
