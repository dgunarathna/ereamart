package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Employee;

public interface DashboardDao extends JpaRepository<Employee, Integer> {

    // --- 4 Primary Metrics (Numbers) ---

    @Query(value = "SELECT COALESCE(SUM(net_amount), 0) FROM invoice WHERE DATE(added_datetime) = CURRENT_DATE();", nativeQuery = true)
    Double getTodayRevenue();

    @Query(value = "SELECT COALESCE(SUM(paid_amount), 0) FROM expenses WHERE DATE(added_datetime) = CURRENT_DATE();", nativeQuery = true)
    Double getTodayExpenses();

    @Query(value = "SELECT (SELECT COALESCE(SUM(net_amount),0) FROM invoice WHERE DATE(added_datetime) = CURRENT_DATE()) - (SELECT COALESCE(SUM(paid_amount),0) FROM expenses WHERE DATE(added_datetime) = CURRENT_DATE());", nativeQuery = true)
    Double getTodayNetProfit();

    @Query(value = "SELECT COALESCE(SUM(total_qty * sales_price), 0) FROM inventory;", nativeQuery = true)
    Double getTodayInventoryValue();


    // --- 7 Analytical Charts (Report Style) ---

    // 1. Monthly Revenue Trend
    @Query(value = "SELECT monthname(added_datetime), SUM(net_amount) FROM invoice WHERE added_datetime BETWEEN CURRENT_DATE() - INTERVAL 12 MONTH AND CURRENT_DATE() GROUP BY monthname(added_datetime) ORDER BY MIN(added_datetime);", nativeQuery = true)
    String[][] getMonthlyRevenueTrend();

    // 2. Sales by Categories
    @Query(value = "SELECT pm.name, SUM(ihp.lineprice) FROM invoice_has_product as ihp JOIN product as p ON ihp.product_id = p.id JOIN productmanufacture as pm ON p.productmanufacture_id = pm.id GROUP BY pm.name ORDER BY SUM(ihp.lineprice) DESC LIMIT 5;", nativeQuery = true)
    String[][] getTopSellingCategories();

    // 3. Top Loyal Customers
    @Query(value = "SELECT c.fullname, SUM(i.net_amount) FROM invoice as i JOIN customer as c ON i.customer_id = c.id GROUP BY c.fullname ORDER BY SUM(i.net_amount) DESC LIMIT 5;", nativeQuery = true)
    String[][] getTopLoyalCustomers();

    // 4. Inventory Health Status
    @Query(value = "SELECT status, COUNT(*) FROM (SELECT CASE WHEN expire_date < CURRENT_DATE() THEN 'Expired' WHEN expire_date < CURRENT_DATE() + INTERVAL 10 DAY THEN 'Expiring' WHEN total_qty < p.rop THEN 'Low Stock' ELSE 'Healthy' END as status FROM inventory as i JOIN product as p ON i.product_id = p.id) as t GROUP BY status;", nativeQuery = true)
    String[][] getInventoryHealthStatus();

    // 5. Best Selling Products
    @Query(value = "SELECT p.name, SUM(ihp.quantity) FROM invoice_has_product as ihp JOIN product as p ON ihp.product_id = p.id GROUP BY p.name ORDER BY SUM(ihp.quantity) DESC LIMIT 5;", nativeQuery = true)
    String[][] getBestSellingProducts();

    // 6. Expense Distribution
    @Query(value = "SELECT expenses_category, SUM(paid_amount) FROM expenses GROUP BY expenses_category;", nativeQuery = true)
    String[][] getExpenseCategoryBreakdown();

    // 7. Monthly Income vs Expense Trend
    @Query(value = "SELECT monthname(t.added_datetime) as label, SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as income, SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as expense FROM (SELECT added_datetime, net_amount as amount, 'income' as type FROM invoice UNION ALL SELECT added_datetime, paid_amount as amount, 'expense' as type FROM expenses) as t GROUP BY monthname(t.added_datetime) ORDER BY MIN(t.added_datetime);", nativeQuery = true)
    String[][] getIncomeExpenseTrend();

}
