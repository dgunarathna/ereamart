package com.ereamart.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Employee;

public interface ReportDao extends JpaRepository<Employee, Integer> {

    // Purchasing & Suppliers *************
    // orders
    // monthly
    @Query(value = "SELECT monthname(o.added_datetime), sum(o.total_amount) FROM orders as o where date(o.added_datetime) between current_date() - interval 6 MONTH and current_date() group by monthname(o.added_datetime);", nativeQuery = true)
    String[][] getPaymentReportByTime();

    // orders
    // Monthly
    @Query(value = "SELECT monthname(o.added_datetime), sum(o.total_amount) FROM orders as o where date(o.added_datetime) between ?1 and ?2 group by monthname(o.added_datetime);", nativeQuery = true)
    String[][] getPaymentsByMonth(String startdate, String enddate);

    // Weekly
    @Query(value = "SELECT week(o.added_datetime), sum(o.total_amount) FROM orders as o where date(o.added_datetime) between ?1 and ?2 group by week(o.added_datetime);", nativeQuery = true)
    String[][] getPaymentsByWeek(String startdate, String enddate);

    // daily
    @Query(value = "SELECT day(o.added_datetime), sum(o.total_amount) FROM orders as o where date(o.added_datetime) between ?1 and ?2 group by day(o.added_datetime);", nativeQuery = true)
    String[][] getPaymentsByDay(String startdate, String enddate);

    // Supplier Spending
    // monthly
    @Query(value = "SELECT s.name, sum(o.total_amount) FROM orders as o inner join supplier as s on o.supplier_id = s.id where date(o.added_datetime) between current_date() - interval 6 MONTH and current_date() group by s.name;", nativeQuery = true)
    String[][] getSupplierSpendingReportByTime();

    // Monthly
    @Query(value = "SELECT s.name, sum(o.total_amount) FROM orders as o inner join supplier as s on o.supplier_id = s.id where date(o.added_datetime) between ?1 and ?2 group by s.name;", nativeQuery = true)
    String[][] getSupplierSpendingReportByMonth(String startdate, String enddate);

    // Weekly
    @Query(value = "SELECT s.name, sum(o.total_amount) FROM orders as o inner join supplier as s on o.supplier_id = s.id where date(o.added_datetime) between ?1 and ?2 group by s.name;", nativeQuery = true)
    String[][] getSupplierSpendingReportByWeek(String startdate, String enddate);

    // daily
    @Query(value = "SELECT s.name, sum(o.total_amount) FROM orders as o inner join supplier as s on o.supplier_id = s.id where date(o.added_datetime) between ?1 and ?2 group by s.name;", nativeQuery = true)
    String[][] getSupplierSpendingReportByDay(String startdate, String enddate);

    // Inventory & Products *************
    // Stock Availability
    // monthly
    @Query(value = "SELECT p.name, sum(i.total_qty) FROM inventory as i inner join product as p on i.product_id = p.id where date(i.added_datetime) between current_date() - interval 6 MONTH and current_date() group by p.name;", nativeQuery = true)
    String[][] getStockAvailabilityReportByTime();

    // Monthly
    @Query(value = "SELECT p.name, sum(i.total_qty) FROM inventory as i inner join product as p on i.product_id = p.id where date(i.added_datetime) between ?1 and ?2 group by p.name;", nativeQuery = true)
    String[][] getStockAvailabilityByMonth(String startdate, String enddate);

    // Weekly
    @Query(value = "SELECT p.name, sum(i.total_qty) FROM inventory as i inner join product as p on i.product_id = p.id where date(i.added_datetime) between ?1 and ?2 group by p.name;", nativeQuery = true)
    String[][] getStockAvailabilityByWeek(String startdate, String enddate);

    // daily
    @Query(value = "SELECT p.name, sum(i.total_qty) FROM inventory as i inner join product as p on i.product_id = p.id where date(i.added_datetime) between ?1 and ?2 group by p.name;", nativeQuery = true)
    String[][] getStockAvailabilityByDay(String startdate, String enddate);

    // Low Stock
    // monthly
    @Query(value = "SELECT p.name, SUM(i.total_qty) FROM inventory AS i INNER JOIN product AS p ON i.product_id = p.id WHERE i.delete_datetime IS NULL AND p.delete_datetime IS NULL GROUP BY p.id, p.name, p.rop HAVING SUM(i.total_qty) <= p.rop;", nativeQuery = true)
    String[][] getLowStockReportByTime();

    // Monthly
    @Query(value = "SELECT p.name, SUM(i.total_qty) FROM inventory AS i INNER JOIN product AS p ON i.product_id = p.id WHERE i.delete_datetime IS NULL AND p.delete_datetime IS NULL AND date(i.added_datetime) BETWEEN ?1 AND ?2 GROUP BY p.id, p.name, p.rop HAVING SUM(i.total_qty) <= p.rop;", nativeQuery = true)
    String[][] getLowStockByMonth(String startdate, String enddate);

    // Weekly
    @Query(value = "SELECT p.name, SUM(i.total_qty) FROM inventory AS i INNER JOIN product AS p ON i.product_id = p.id WHERE i.delete_datetime IS NULL AND p.delete_datetime IS NULL AND date(i.added_datetime) BETWEEN ?1 AND ?2 GROUP BY p.id, p.name, p.rop HAVING SUM(i.total_qty) <= p.rop;", nativeQuery = true)
    String[][] getLowStockByWeek(String startdate, String enddate);

    // daily
    @Query(value = "SELECT p.name, SUM(i.total_qty) FROM inventory AS i INNER JOIN product AS p ON i.product_id = p.id WHERE i.delete_datetime IS NULL AND p.delete_datetime IS NULL AND date(i.added_datetime) BETWEEN ?1 AND ?2 GROUP BY p.id, p.name, p.rop HAVING SUM(i.total_qty) <= p.rop;", nativeQuery = true)
    String[][] getLowStockByDay(String startdate, String enddate);

    // Expiring Stock
    // monthly
    @Query(value = "SELECT p.name, sum(i.total_qty) FROM inventory as i inner join product as p on i.product_id = p.id where i.expire_date between current_date() and current_date() + interval 3 MONTH group by p.name;", nativeQuery = true)
    String[][] getExpiringStockReportByTime();

    // Monthly
    @Query(value = "SELECT p.name, sum(i.total_qty) FROM inventory as i inner join product as p on i.product_id = p.id where i.expire_date between ?1 and ?2 group by p.name;", nativeQuery = true)
    String[][] getExpiringStockByMonth(String startdate, String enddate);

    // Weekly
    @Query(value = "SELECT p.name, sum(i.total_qty) FROM inventory as i inner join product as p on i.product_id = p.id where i.expire_date between ?1 and ?2 group by p.name;", nativeQuery = true)
    String[][] getExpiringStockByWeek(String startdate, String enddate);

    // daily
    @Query(value = "SELECT p.name, sum(i.total_qty) FROM inventory as i inner join product as p on i.product_id = p.id where i.expire_date between ?1 and ?2 group by p.name;", nativeQuery = true)
    String[][] getExpiringStockByDay(String startdate, String enddate);

    // Stock by Manufacturer
    // monthly
    @Query(value = "SELECT pm.name, sum(i.total_qty) FROM inventory as i inner join product as p on i.product_id = p.id inner join productmanufacture as pm on p.productmanufacture_id = pm.id where date(i.added_datetime) between current_date() - interval 6 MONTH and current_date() group by pm.name;", nativeQuery = true)
    String[][] getStockByManufacturerReportByTime();

    // Monthly
    @Query(value = "SELECT pm.name, sum(i.total_qty) FROM inventory as i inner join product as p on i.product_id = p.id inner join productmanufacture as pm on p.productmanufacture_id = pm.id where date(i.added_datetime) between ?1 and ?2 group by pm.name;", nativeQuery = true)
    String[][] getStockByManufacturerByMonth(String startdate, String enddate);

    // Weekly
    @Query(value = "SELECT pm.name, sum(i.total_qty) FROM inventory as i inner join product as p on i.product_id = p.id inner join productmanufacture as pm on p.productmanufacture_id = pm.id where date(i.added_datetime) between ?1 and ?2 group by pm.name;", nativeQuery = true)
    String[][] getStockByManufacturerByWeek(String startdate, String enddate);

    // daily
    @Query(value = "SELECT pm.name, sum(i.total_qty) FROM inventory as i inner join product as p on i.product_id = p.id inner join productmanufacture as pm on p.productmanufacture_id = pm.id where date(i.added_datetime) between ?1 and ?2 group by pm.name;", nativeQuery = true)
    String[][] getStockByManufacturerByDay(String startdate, String enddate);

    // Sales & Revenue *************
    // Invoice payment status breakdown
    // monthly
    @Query(value = "SELECT monthname(i.added_datetime), sum(i.total_amount) FROM invoice as i where date(i.added_datetime) between current_date() - interval 6 MONTH and current_date() group by monthname(i.added_datetime);", nativeQuery = true)
    String[][] getInvoiceReportByTime();

    // Monthly
    @Query(value = "SELECT monthname(i.added_datetime), sum(i.total_amount) FROM invoice as i where date(i.added_datetime) between ?1 and ?2 group by monthname(i.added_datetime);", nativeQuery = true)
    String[][] getInvoicesByMonth(String startdate, String enddate);

    // Weekly
    @Query(value = "SELECT week(i.added_datetime), sum(i.total_amount) FROM invoice as i where date(i.added_datetime) between ?1 and ?2 group by week(i.added_datetime);", nativeQuery = true)
    String[][] getInvoicesByWeek(String startdate, String enddate);

    // daily
    @Query(value = "SELECT day(i.added_datetime), sum(i.total_amount) FROM invoice as i where date(i.added_datetime) between ?1 and ?2 group by day(i.added_datetime);", nativeQuery = true)
    String[][] getInvoicesByDay(String startdate, String enddate);

    // Customer Loyalty
    // monthly
    @Query(value = "SELECT c.fullname, sum(i.total_amount) FROM invoice as i join customer as c on i.customer_id = c.id where date(i.added_datetime) between current_date() - interval 6 MONTH and current_date() group by c.fullname;", nativeQuery = true)
    String[][] getCustomerLoyaltyReportByTime();

    // Monthly
    @Query(value = "SELECT c.fullname, sum(i.total_amount) FROM invoice as i join customer as c on i.customer_id = c.id where date(i.added_datetime) between ?1 and ?2 group by c.fullname;", nativeQuery = true)
    String[][] getCustomerLoyaltyByMonth(String startdate, String enddate);

    // Weekly
    @Query(value = "SELECT c.fullname, sum(i.total_amount) FROM invoice as i join customer as c on i.customer_id = c.id where date(i.added_datetime) between ?1 and ?2 group by c.fullname;", nativeQuery = true)
    String[][] getCustomerLoyaltyByWeek(String startdate, String enddate);

    // daily
    @Query(value = "SELECT c.fullname, sum(i.total_amount) FROM invoice as i join customer as c on i.customer_id = c.id where date(i.added_datetime) between ?1 and ?2 group by c.fullname;", nativeQuery = true)
    String[][] getCustomerLoyaltyByDay(String startdate, String enddate);

    // Best Selling Products
    // monthly
    @Query(value = "SELECT p.name, sum(ihp.quantity) FROM invoice_has_product as ihp join product as p on ihp.product_id = p.id join invoice as i on ihp.invoice_id = i.id where date(i.added_datetime) between current_date() - interval 6 MONTH and current_date() group by p.name limit 5;", nativeQuery = true)
    String[][] getBestSellingProductsReportByTime();

    // Monthly
    @Query(value = "SELECT p.name, sum(ihp.quantity) FROM invoice_has_product as ihp join product as p on ihp.product_id = p.id join invoice as i on ihp.invoice_id = i.id where date(i.added_datetime) between ?1 and ?2 group by p.name limit 5;", nativeQuery = true)
    String[][] getBestSellingProductsByMonth(String startdate, String enddate);

    // Weekly
    @Query(value = "SELECT p.name, sum(ihp.quantity) FROM invoice_has_product as ihp join product as p on ihp.product_id = p.id join invoice as i on ihp.invoice_id = i.id where date(i.added_datetime) between ?1 and ?2 group by p.name limit 5;", nativeQuery = true)
    String[][] getBestSellingProductsByWeek(String startdate, String enddate);

    // daily
    @Query(value = "SELECT p.name, sum(ihp.quantity) FROM invoice_has_product as ihp join product as p on ihp.product_id = p.id join invoice as i on ihp.invoice_id = i.id where date(i.added_datetime) between ?1 and ?2 group by p.name limit 5;", nativeQuery = true)
    String[][] getBestSellingProductsByDay(String startdate, String enddate);

    // Finance & Expenses *************
    // Income and Expense
    // monthly
    @Query(value = "SELECT monthname(t.added_datetime) as label, SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as income, SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as expense FROM (SELECT added_datetime, net_amount as amount, 'income' as type FROM invoice UNION ALL SELECT added_datetime, paid_amount as amount, 'expense' as type FROM expenses) as t WHERE date(t.added_datetime) BETWEEN current_date() - interval 6 MONTH and current_date() GROUP BY monthname(t.added_datetime) ORDER BY MIN(t.added_datetime);", nativeQuery = true)
    String[][] getIncomeExpenseReportByTime();

    // Monthly
    @Query(value = "SELECT monthname(t.added_datetime) as label, SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as income, SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as expense FROM (SELECT added_datetime, net_amount as amount, 'income' as type FROM invoice UNION ALL SELECT added_datetime, paid_amount as amount, 'expense' as type FROM expenses) as t WHERE date(t.added_datetime) BETWEEN ?1 AND ?2 GROUP BY monthname(t.added_datetime) ORDER BY MIN(t.added_datetime);", nativeQuery = true)
    String[][] getIncomeExpensesByMonth(String startdate, String enddate);

    // Weekly
    @Query(value = "SELECT week(t.added_datetime) as label, SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as income, SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as expense FROM (SELECT added_datetime, net_amount as amount, 'income' as type FROM invoice UNION ALL SELECT added_datetime, paid_amount as amount, 'expense' as type FROM expenses) as t WHERE date(t.added_datetime) BETWEEN ?1 AND ?2 GROUP BY week(t.added_datetime) ORDER BY MIN(t.added_datetime);", nativeQuery = true)
    String[][] getIncomeExpensesByWeek(String startdate, String enddate);

    // daily
    @Query(value = "SELECT day(t.added_datetime) as label, SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as income, SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as expense FROM (SELECT added_datetime, net_amount as amount, 'income' as type FROM invoice UNION ALL SELECT added_datetime, paid_amount as amount, 'expense' as type FROM expenses) as t WHERE date(t.added_datetime) BETWEEN ?1 AND ?2 GROUP BY day(t.added_datetime) ORDER BY MIN(t.added_datetime);", nativeQuery = true)
    String[][] getIncomeExpensesByDay(String startdate, String enddate);

    // Income and Expense Category
    // monthly
    @Query(value = "SELECT expenses_category, sum(paid_amount) FROM expenses where date(added_datetime) between current_date() - interval 6 MONTH and current_date() group by expenses_category;", nativeQuery = true)
    String[][] getIncomeExpenseCategoryReportByTime();

    // Monthly
    @Query(value = "SELECT expenses_category, sum(paid_amount) FROM expenses where date(added_datetime) between ?1 and ?2 group by expenses_category;", nativeQuery = true)
    String[][] getIncomeExpensesCategoryByMonth(String startdate, String enddate);

    // Weekly
    @Query(value = "SELECT expenses_category, sum(paid_amount) FROM expenses where date(added_datetime) between ?1 and ?2 group by expenses_category;", nativeQuery = true)
    String[][] getIncomeExpensesCategoryByWeek(String startdate, String enddate);

    // daily
    @Query(value = "SELECT expenses_category, sum(paid_amount) FROM expenses where date(added_datetime) between ?1 and ?2 group by expenses_category;", nativeQuery = true)
    String[][] getIncomeExpensesCategoryByDay(String startdate, String enddate);

}