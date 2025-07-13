package com.ereamart.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // this class genatate as an entity
@Table(name = "supplier_has_product") //table mapping

@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor
@JsonInclude(value = Include.NON_NULL)

public class SupplierHasProduct {

    @Id
    @ManyToOne()
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private ProductBrand supplier_id;

    @Id
    @ManyToOne()
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private ProductBrand product_id;
}
