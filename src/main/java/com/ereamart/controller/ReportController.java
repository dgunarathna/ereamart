package com.ereamart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.ReportDao;
import com.ereamart.dao.UserDao;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.User;

@RestController
public class ReportController {

	@Autowired
    public ReportDao reportDao;

    @Autowired
	private UserDao userDao;

    @Autowired
	private UserPrivilegeController userPrivilegeController;

    // mapping for return report page
    @RequestMapping(value =  {"/report","/report.html"})
    public ModelAndView uiReportPage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	User loggedUser = userDao.getByUsename(auth.getName());

	ModelAndView reportPage = new ModelAndView();   
	reportPage.setViewName("report.html");
	reportPage.addObject("loggedusername", auth.getName());
    reportPage.addObject("pageTitle", "Report");
	reportPage.addObject("loggeduserphoto", loggedUser.getUserphoto());

	return reportPage;
	}
  
    //Purchasing & Suppliers *************
    //request mapping for load productdepartment all data - /reportpayment/bytime?startdate=2015-01-01&enddate=2025-08-01&type=Daily
    @GetMapping(value = "/reportpayment/bytime", params = {"startdate","enddate","type"} , produces = "application/json")
    public String[][] getPaymentReportByTime(@RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");
        
        if (userPrivilege.getPrivi_select()) {
			if (type.equals("Monthly")) {
                return reportDao.getPaymentsByMonth(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getPaymentsByWeek(startdate, enddate);
            }
            if (type.equals("Daily")) {
                return reportDao.getPaymentsByDay(startdate, enddate);
            } 
            return new String[0][0];
		} else {
			return new String[0][0];
		}
    } 

    //request mapping for load generateSupplierSpendingReport
    @GetMapping(value = "/reportsupplierspending/bytime", params = {"startdate","enddate","type"} , produces = "application/json")
    public String[][] getSupplierSpendingReportByTime(@RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");
        
        if (userPrivilege.getPrivi_select()) {
			if (type.equals("Monthly")) {
                return reportDao.getSupplierSpendingReportByMonth(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getSupplierSpendingReportByWeek(startdate, enddate);
            }
            if (type.equals("Daily")) {
                return reportDao.getSupplierSpendingReportByDay(startdate, enddate);
            } 
            return new String[0][0];
		} else {
			return new String[0][0];
		}
    } 


    //Inventory & Products *************
    //request mapping for load productdepartment all data - /reportinvoice/bytime?startdate=2015-01-01&enddate=2025-08-01&type=Daily
    @GetMapping(value = "/reportstockavailability/bytime", params = {"startdate","enddate","type"} , produces = "application/json")
    public String[][] getStockAvailabilityReportByTime(@RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");
        
        if (userPrivilege.getPrivi_select()) {
			if (type.equals("Monthly")) {
                return reportDao.getStockAvailabilityByMonth(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getStockAvailabilityByWeek(startdate, enddate);
            }
            if (type.equals("Daily")) {
                return reportDao.getStockAvailabilityByDay(startdate, enddate);
            } 
            return new String[0][0];
		} else {
			return new String[0][0];
		}
    } 

    //request mapping for load productdepartment all data - /reportinvoice/bytime?startdate=2015-01-01&enddate=2025-08-01&type=Daily
    @GetMapping(value = "/reportlowstock/bytime", params = {"startdate","enddate","type"} , produces = "application/json")
    public String[][] getLowStockReportByTime(@RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");
        
        if (userPrivilege.getPrivi_select()) {
			if (type.equals("Monthly")) {
                return reportDao.getLowStockByMonth(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getLowStockByWeek(startdate, enddate);
            }
            if (type.equals("Daily")) {
                return reportDao.getLowStockByDay(startdate, enddate);
            } 
            return new String[0][0];
		} else {
			return new String[0][0];
		}
    } 

    //request mapping for load productdepartment all data - /reportinvoice/bytime?startdate=2015-01-01&enddate=2025-08-01&type=Daily
    @GetMapping(value = "/reportexpiringstock/bytime", params = {"startdate","enddate","type"} , produces = "application/json")
    public String[][] getExpiringStockReportByTime(@RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");
        
        if (userPrivilege.getPrivi_select()) {
			if (type.equals("Monthly")) {
                return reportDao.getExpiringStockByMonth(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getExpiringStockByWeek(startdate, enddate);
            }
            if (type.equals("Daily")) {
                return reportDao.getExpiringStockByDay(startdate, enddate);
            } 
            return new String[0][0];
		} else {
			return new String[0][0];
		}
    } 

    //request mapping for load productdepartment all data - /reportinvoice/bytime?startdate=2015-01-01&enddate=2025-08-01&type=Daily
    @GetMapping(value = "/reportstockbymanufacturer/bytime", params = {"startdate","enddate","type"} , produces = "application/json")
    public String[][] getStockByManufacturerReportByTime(@RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");
        
        if (userPrivilege.getPrivi_select()) {
			if (type.equals("Monthly")) {
                return reportDao.getStockByManufacturerByMonth(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getStockByManufacturerByWeek(startdate, enddate);
            }
            if (type.equals("Daily")) {
                return reportDao.getStockByManufacturerByDay(startdate, enddate);
            } 
            return new String[0][0];
		} else {
			return new String[0][0];
		}
    } 


    //Sales & Revenue *************
    //request mapping for load productdepartment all data - /reportinvoice/bytime?startdate=2015-01-01&enddate=2025-08-01&type=Daily
    @GetMapping(value = "/reportinvoice/bytime", params = {"startdate","enddate","type"} , produces = "application/json")
    public String[][] getInvoiceReportByTime(@RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");
        
        if (userPrivilege.getPrivi_select()) {
			if (type.equals("Monthly")) {
                return reportDao.getInvoicesByMonth(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getInvoicesByWeek(startdate, enddate);
            }
            if (type.equals("Daily")) {
                return reportDao.getInvoicesByDay(startdate, enddate);
            } 
            return new String[0][0];
		} else {
			return new String[0][0];
		}
    } 

    //request mapping for load productdepartment all data - /reportinvoice/bytime?startdate=2015-01-01&enddate=2025-08-01&type=Daily
    @GetMapping(value = "/reportcustomerloyalty/bytime", params = {"startdate","enddate","type"} , produces = "application/json")
    public String[][] getCustomerLoyaltyReportByTime(@RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");
        
        if (userPrivilege.getPrivi_select()) {
			if (type.equals("Monthly")) {
                return reportDao.getCustomerLoyaltyByMonth(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getCustomerLoyaltyByWeek(startdate, enddate);
            }
            if (type.equals("Daily")) {
                return reportDao.getCustomerLoyaltyByDay(startdate, enddate);
            } 
            return new String[0][0];
		} else {
			return new String[0][0];
		}
    } 

    //request mapping for load productdepartment all data - /reportinvoice/bytime?startdate=2015-01-01&enddate=2025-08-01&type=Daily
    @GetMapping(value = "/reportbestsellingproducts/bytime", params = {"startdate","enddate","type"} , produces = "application/json")
    public String[][] getBestSellingProductsReportByTime(@RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");
        
        if (userPrivilege.getPrivi_select()) {
			if (type.equals("Monthly")) {
                return reportDao.getBestSellingProductsByMonth(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getBestSellingProductsByWeek(startdate, enddate);
            }
            if (type.equals("Daily")) {
                return reportDao.getBestSellingProductsByDay(startdate, enddate);
            } 
            return new String[0][0];
		} else {
			return new String[0][0];
		}
    } 
    
    
    //Finance & Expenses *************
    //request mapping for load productdepartment all data - /reportinvoice/bytime?startdate=2015-01-01&enddate=2025-08-01&type=Daily
    @GetMapping(value = "/reportincomeexpense/bytime", params = {"startdate","enddate","type"} , produces = "application/json")
    public String[][] getIncomeExpenseReportByTime(@RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");
        
        if (userPrivilege.getPrivi_select()) {
			if (type.equals("Monthly")) {
                return reportDao.getIncomeExpensesByMonth(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getIncomeExpensesByWeek(startdate, enddate);
            }
            if (type.equals("Daily")) {
                return reportDao.getIncomeExpensesByDay(startdate, enddate);
            } 
            return new String[0][0];
		} else {
			return new String[0][0];
		}
    } 

    //request mapping for load productdepartment all data - /reportinvoice/bytime?startdate=2015-01-01&enddate=2025-08-01&type=Daily
    @GetMapping(value = "/reportincomeexpense/category/bytime", params = {"startdate","enddate","type"} , produces = "application/json")
    public String[][] getIncomeExpenseCategoryReportByTime(@RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Report");
        
        if (userPrivilege.getPrivi_select()) {
			if (type.equals("Monthly")) {
                return reportDao.getIncomeExpensesCategoryByMonth(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportDao.getIncomeExpensesCategoryByWeek(startdate, enddate);
            }
            if (type.equals("Daily")) {
                return reportDao.getIncomeExpensesCategoryByDay(startdate, enddate);
            } 
            return new String[0][0];
		} else {
			return new String[0][0];
		}
    } 

}
