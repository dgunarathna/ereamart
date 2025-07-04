package com.ereamart.entity;

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
@Table(name = "privilege") //table mapping

@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor
public class Privilege {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Boolean privi_select;

    @NotNull
    private Boolean privi_insert;

    @NotNull
    private Boolean privi_update;

    @NotNull
    private Boolean privi_delete;

    @ManyToOne()
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role module_id;

    @ManyToOne()
    @JoinColumn(name = "module_id", referencedColumnName = "id")
    private Module role_id;
}
