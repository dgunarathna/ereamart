package com.ereamart.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ereamart.entity.Product;

public interface ProductDao extends JpaRepository<Product, Integer>{ 

    @Query(value = "Select p from Product p where p.name=?1") 
    Product getByName(String name);

    Product getByBarcode(String barcode);

    //for get next code when new product
    @Query(value = "SELECT CONCAT('P', COALESCE(MAX(CAST(SUBSTRING(p.code, 2) AS UNSIGNED)) + 1, 1)) FROM ereamart.product as p;", nativeQuery = true)
    String getNextCode();

    @Query(value = "select p from Product p where p.id in (select shp.product_id.id from SupplierHasProduct shp where shp.supplier_id.id=?1)")
    List<Product> findProductBySupplier(Integer supplierid);

    @Query(value = "select p from Product p where p.id in (select ohp.product_id.id from OrdersHasProduct ohp where ohp.orders_id.id=?1)")
    List<Product> findProductByOrdersCode(Integer ordersid);

    @Query(value = "select p from Product p where p.id in (select grnhp.product_id.id from GRNHasProduct grnhp where grnhp.grn_id.id=?1)")
    List<Product> findProductByGRNCode(Integer grnid);

    @Query(value = "Select p from Product p where p.id not in(select shp.product_id.id from SupplierHasProduct shp where shp.supplier_id.id=?1)")
    List<Product> findProductWithoutSupply(Integer supplierid);

    @Query(value = "SELECT p.roq FROM Product p WHERE p.id = ?1")
    Integer findROQByProduct(Integer productid);

    @Query(value = "select p from Product p where p.id in (select qhp.product_id.id from QuotationHasProduct qhp where qhp.quotation_id.id = ?1)")
    List<Product> findProductByQuotationID(Integer quotationID);

    @Query("SELECT qhp.quantity FROM QuotationHasProduct qhp WHERE qhp.quotation_id.id = ?1 AND qhp.product_id.id = ?2")
    Integer findQuantityByQuotationAndProduct(Integer quotationID, Integer productID);

    @Query(value = "select p from Product p where p.id in (select rhp.product_id.id from RespondHasProduct rhp where rhp.respond_id.id = ?1)")
    List<Product> findProductByRespondID(Integer respondid);




}