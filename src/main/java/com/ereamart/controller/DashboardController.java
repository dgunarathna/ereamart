package com.ereamart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.DashboardDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.User;

@RestController
public class DashboardController {

    @Autowired
    private DashboardDao dashboardDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    // mapping for return dashboard page
    @RequestMapping(value = {"/dashboard", "/dashboard.html"})
    public ModelAndView uiDashboardPage() {

        //check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsename(auth.getName());

        ModelAndView dashboardPage = new ModelAndView();
        dashboardPage.setViewName("dashboard.html");
        dashboardPage.addObject("loggedusername", auth.getName());
        dashboardPage.addObject("pageTitle", "Dashboard");
        dashboardPage.addObject("loggeduserphoto", loggedUser.getUserphoto());

        return dashboardPage;
    }

    // mapping for return profile page
    @RequestMapping(value = {"/profile", "/profile.html"})
    public ModelAndView uiProfilePage() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsename(auth.getName());


        ModelAndView profilePage = new ModelAndView();
        profilePage.setViewName("profile.html");
        profilePage.addObject("loggedusername", auth.getName());
        profilePage.addObject("pageTitle", "Profile");
        profilePage.addObject("loggeduserphoto", loggedUser.getUserphoto());

        return profilePage;
    }

    // --- Metrics Endpoints ---

    @GetMapping(value = "/dashboard/daily-revenue", produces = "application/json")
    public Double getDailyRevenue() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Dashboard");
        if (userPrivilege.getPrivi_select()) {
            return dashboardDao.getTodayRevenue();
        } else {
            return 0.0;
        }
    }

    @GetMapping(value = "/dashboard/daily-expenses", produces = "application/json")
    public Double getDailyExpenses() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Dashboard");
        if (userPrivilege.getPrivi_select()) {
            return dashboardDao.getTodayExpenses();
        } else {
            return 0.0;
        }
    }

    @GetMapping(value = "/dashboard/daily-profit", produces = "application/json")
    public Double getDailyProfit() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Dashboard");
        if (userPrivilege.getPrivi_select()) {
            return dashboardDao.getTodayNetProfit();
        } else {
            return 0.0;
        }
    }

    @GetMapping(value = "/dashboard/inventory-value", produces = "application/json")
    public Double getInventoryValue() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Dashboard");
        if (userPrivilege.getPrivi_select()) {
            return dashboardDao.getTodayInventoryValue();
        } else {
            return 0.0;
        }
    }

    // --- Chart Endpoints ---

    @GetMapping(value = "/dashboard/revenue-trend", produces = "application/json")
    public String[][] getRevenueTrend() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Dashboard");
        if (userPrivilege.getPrivi_select()) {
            return dashboardDao.getMonthlyRevenueTrend();
        } else {
            return new String[0][0];
        }
    }

    @GetMapping(value = "/dashboard/sales-category", produces = "application/json")
    public String[][] getSalesByCategory() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Dashboard");
        if (userPrivilege.getPrivi_select()) {
            return dashboardDao.getTopSellingCategories();
        } else {
            return new String[0][0];
        }
    }

    @GetMapping(value = "/dashboard/top-customers", produces = "application/json")
    public String[][] getTopCustomers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Dashboard");
        if (userPrivilege.getPrivi_select()) {
            return dashboardDao.getTopLoyalCustomers();
        } else {
            return new String[0][0];
        }
    }

    @GetMapping(value = "/dashboard/inventory-status", produces = "application/json")
    public String[][] getInventoryStatus() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Dashboard");
        if (userPrivilege.getPrivi_select()) {
            return dashboardDao.getInventoryHealthStatus();
        } else {
            return new String[0][0];
        }
    }

    @GetMapping(value = "/dashboard/best-sellers", produces = "application/json")
    public String[][] getBestSellers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Dashboard");
        if (userPrivilege.getPrivi_select()) {
            return dashboardDao.getBestSellingProducts();
        } else {
            return new String[0][0];
        }
    }

    @GetMapping(value = "/dashboard/expense-distribution", produces = "application/json")
    public String[][] getExpenseDistribution() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Dashboard");
        if (userPrivilege.getPrivi_select()) {
            return dashboardDao.getExpenseCategoryBreakdown();
        } else {
            return new String[0][0];
        }
    }

    @GetMapping(value = "/dashboard/income-expense-trend", produces = "application/json")
    public String[][] getIncomeExpenseTrend() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Dashboard");
        if (userPrivilege.getPrivi_select()) {
            return dashboardDao.getIncomeExpenseTrend();
        } else {
            return new String[0][0];
        }
    }

}


