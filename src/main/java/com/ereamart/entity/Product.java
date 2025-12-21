package com.ereamart.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // this class genatate as an entity
@Table(name = "product") //table mapping
@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor
@JsonInclude(value = Include.NON_NULL)

public class Product {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY) // auto increment pk
    private Integer id;

    private byte[] image;

    @NotNull
    private String name;

    @NotNull
    private String code;
    
    private String barcode;
    @NotNull
    private String size;

    private String unit;

    @NotNull
    private Integer rop;
    
    @NotNull
    private Integer roq;

    @NotNull
    private LocalDateTime added_datetime;

    private LocalDateTime update_datetime;

    private LocalDateTime delete_datetime;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    @ManyToOne()
    @JoinColumn(name = "productmanufacture_id", referencedColumnName = "id")
    private ProductManufacture productmanufacture_id;

    @ManyToOne()
    @JoinColumn(name = "productstatus_id", referencedColumnName = "id")
    private ProductStatus productstatus_id;

    @OneToOne()
    @JoinColumn(name = "productitem_id", referencedColumnName = "id")
    private ProductItem productitem_id;
    
    @OneToOne()
    @JoinColumn(name = "productbrand_id", referencedColumnName = "id")
    private ProductBrand productbrand_id;

}
