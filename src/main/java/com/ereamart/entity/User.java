package com.ereamart.entity;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.CascadeType;  
import jakarta.persistence.Column;
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
@Table(name = "user") //table mapping

@Data // for settes getters
@AllArgsConstructor // allconstructor
@NoArgsConstructor // default constructor
public class User {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY) // auto increment pk
    private Integer id;

    @NotNull
    @Column(name = "username", unique = true)
    private String username;

    @NotNull
    private String password;

    @NotNull
    @Column(name = "email", unique = true)
    private String email;

    @NotNull
    private Boolean status;

    private byte[] userphoto;

    private String note;

    @NotNull
    private LocalDateTime added_datetime;

    private LocalDateTime update_datetime;

    private LocalDateTime delete_datetime;

    @ManyToOne(optional = true)
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee_id;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "user_has_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name= "role_id"))
    private Set<Role>roles;
}
