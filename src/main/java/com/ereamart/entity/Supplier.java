package com.ereamart.entity;

import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // this class genatate as an entity
@Table(name = "supplier") //table mapping

@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor

public class Supplier {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY) // auto increment pk
    private Integer id;
    private String reg_no;
    private String supplier_brn;
    private String name;
    private String email;
    private String mobile_no;
    private String address;
    private String description;
    private String bank;
    private String branch;
    private Integer account_no;
    private String order;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "supplier_has_product", joinColumns = @JoinColumn(name = "supplier_id"), inverseJoinColumns = @JoinColumn(name= "product_id"))
    private Set<Product>supplyProducts;

    @ManyToOne(optional = true)
    @JoinColumn(name = "suplier_status_id", referencedColumnName = "id")
    private SupplierStatus suplier_status_id;

}
