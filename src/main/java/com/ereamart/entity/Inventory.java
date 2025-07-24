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
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // this class genatate as an entity
@Table(name = "inventory") //table mapping
@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor
@JsonInclude(value = Include.NON_NULL)

public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment pk
    private Integer id;

    private Integer available_qty;

    private Integer total_qty;

    private Integer sales_price;

    private Integer expire_date;

    private Integer manufacture_date;

    private Integer batch_number;

    private Integer grn_no;

    
    @NotNull
    private LocalDateTime added_datetime;

    private LocalDateTime update_datetime;

    private LocalDateTime delete_datetime;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    @ManyToOne()
    @JoinColumn(name = "inventory_status_id", referencedColumnName = "id")
    private InventoryStatus inventory_status_id;
}
