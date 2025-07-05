package com.ereamart.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ereamart.dao.UserDao;
import com.ereamart.entity.Role;
import com.ereamart.entity.User;

import jakarta.transaction.Transactional;

@Service
public class MyUserServiceDetail implements UserDetailsService{

    @Autowired
    private UserDao userdao;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println(username);

        User extUser = userdao.geByUsename(username);

        Set<GrantedAuthority> authority = new HashSet<GrantedAuthority>();

        for(Role userRole : extUser.getRoles()){
            authority.add(new SimpleGrantedAuthority(userRole.getName()));
        }

        return new org.springframework.security.core.userdetails.User(extUser.getUsername(),extUser.getPassword(),extUser.getStatus(),true,true,true, authority);
    }

}
