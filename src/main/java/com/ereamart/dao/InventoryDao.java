package com.ereamart.dao;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import com.ereamart.entity.Inventory;
import com.ereamart.entity.Product;

public interface InventoryDao extends JpaRepository<Inventory, Integer>{

    @Query(value = "Select i from Inventory i where i.batch_number=?1") 
    Product getByName(String name);

    //for get next code
    @Query(value = "SELECT CONCAT('I', COALESCE(MAX(CAST(SUBSTRING(i.inventory_code, 2) AS UNSIGNED)) + 1, 1)) FROM ereamart.inventory as i;", nativeQuery = true)
    String getNextCode();

    @Query(value = "SELECT SUM(total_qty) AS total_qty FROM ereamart.inventory WHERE product_id = 1;", nativeQuery = true)
    Integer findQTYByInventory(Integer productid);

    @Query("SELECT i FROM Inventory i WHERE i.product_id = ?1 AND i.batch_number = ?2")
    Inventory findByProductAndBatch(Product product, String batch);

    @Query("SELECT i FROM Inventory i WHERE i.product_id = ?1")
    Inventory findByProduct(Product product);

    // New: get all inventory rows for a product ordered by expire_date (oldest expire first)
    @Query("SELECT i FROM Inventory i WHERE i.product_id = ?1 ORDER BY i.expire_date ASC")
    List<Inventory> findByProductOrderByExpireDateAsc(Product product);

    @Query("SELECT i.sales_price FROM Inventory i WHERE i.product_id = ?1 ORDER BY i.expire_date ASC")
    BigDecimal findsalespriceByProduct(Integer productid);

    @Query("SELECT DISTINCT i FROM Inventory i LEFT JOIN FETCH i.product_id ORDER BY i.id DESC")
    List<Inventory> findAllWithProduct();
}
