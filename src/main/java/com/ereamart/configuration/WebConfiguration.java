package com.ereamart.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfiguration {

    @Bean
     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        //service authontication 
         http.authorizeHttpRequests(auth -> {
            auth
            .requestMatchers("/bootstrap-5.2.3/**").permitAll()
            .requestMatchers("/images/**").permitAll()
            .requestMatchers("/css/**").permitAll()
            .requestMatchers("/fonts/**").permitAll()
            .requestMatchers("/fontawesome-free-6.6.0/**").permitAll()
            .requestMatchers("/index/**").permitAll()
            .requestMatchers("/login").permitAll()
            .requestMatchers("/register").permitAll() 
            .requestMatchers("/createadmin").permitAll() //create admin
            .requestMatchers("/dashboard").hasAnyAuthority("Admin","Manager", "Cashier") 
            .requestMatchers("/emoloyee/**").hasAnyAuthority("Admin","Manager")
            .requestMatchers("/privilege/**").hasAnyAuthority("Admin","Cashier")
            .requestMatchers("/user/**").hasAnyAuthority("Admin","Manager").anyRequest().authenticated();
         })
         //login details
         .formLogin(login -> {
            login
            .loginPage("/login")
            .defaultSuccessUrl("/dashboard", true)
            .failureUrl("/login?error=usernamepassworderror")
            .usernameParameter("username")
            .passwordParameter("password");
         })
         //logout details
         .logout(logout ->{
            logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/login");
         })
         .exceptionHandling(exp -> {
            exp.accessDeniedPage("/errorpage");
         })
         //block js
         .csrf(csrf ->{
            csrf.disable();
         });
         return http.build();
     }

     @Bean
     public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
     }
}
    