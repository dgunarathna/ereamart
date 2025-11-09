package com.ereamart.entity;

import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

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
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // this class genatate as an entity
@Table(name = "supplier") //table mapping
@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor
@JsonInclude(value = Include.NON_NULL)

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

    private String bank;

    private String branch;
    
    private Integer account_no;

    
    @NotNull
    private LocalDateTime added_datetime;

    private LocalDateTime update_datetime;

    private LocalDateTime delete_datetime;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;
    

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "supplier_has_product", joinColumns = @JoinColumn(name = "supplier_id"), inverseJoinColumns = @JoinColumn(name= "product_id"))
    private Set<Product> supplierItemList;

    @ManyToOne()
    @JoinColumn(name = "supplier_status_id", referencedColumnName = "id")
    private SupplierStatus supplier_status_id;

}
