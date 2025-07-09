package com.ereamart.controller;

import java.util.List;

import org.springframework.web.servlet.ModelAndView;

public interface CommonController<T> {

    public ModelAndView UI();

    public List<T> allData();
    
    public String saveRecord(T t);

    public String updateRecord(T t);

    public String deleteRecord(T t);

}
