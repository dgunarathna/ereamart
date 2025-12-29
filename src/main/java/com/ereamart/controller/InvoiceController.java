package com.ereamart.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ereamart.dao.InventoryDao;
import com.ereamart.dao.InvoiceDao;
import com.ereamart.dao.InvoiceStatusDao;
import com.ereamart.dao.UserDao;
import com.ereamart.dao.InventoryStatusDao;
import com.ereamart.dao.CustomerDao;
import com.ereamart.dao.IncomeDao;
import com.ereamart.dao.IncomeStatusDao;
import com.ereamart.entity.Customer;
import com.ereamart.entity.Income;
import com.ereamart.entity.Inventory;
import com.ereamart.entity.Invoice;
import com.ereamart.entity.InvoiceHasProduct;
import com.ereamart.entity.Privilege;
import com.ereamart.entity.Supplier;
import com.ereamart.entity.User;

@RestController
public class InvoiceController {

	@Autowired // genarate instance of user dao - interface
    private InvoiceDao invoiceDao;

	@Autowired // genarate instance of user dao - interface
    private InvoiceStatusDao invoiceStatusDao;

	@Autowired // genarate instance of user dao - interface
    private UserDao userDao;

	@Autowired // genarate instance of user privilege dao
	private UserPrivilegeController userPrivilegeController;

	@Autowired // generate instance of inventory dao - interface
	private InventoryDao inventoryDao;

    @Autowired
    private InventoryStatusDao inventoryStatusDao;

    @Autowired
    private IncomeDao incomeDao;

    @Autowired
    private IncomeStatusDao incomeStatusDao;

	@Autowired // genarate instance of customer dao - interface
	private CustomerDao customerDao;

    // mapping for return invoice page
    @RequestMapping(value =  {"/invoice","/invoice.html"})
    public ModelAndView uiInvoicePage(){
		
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	User loggedUser = userDao.getByUsename(auth.getName());

	ModelAndView invoicePage = new ModelAndView();   
	invoicePage.setViewName("invoice.html");
	invoicePage.addObject("loggedusername", auth.getName());
	invoicePage.addObject("pageTitle", "Invoice");
	invoicePage.addObject("loggeduserphoto", loggedUser.getUserphoto());

	return invoicePage;
	}

	//request mapping for load invoice all data - /invoice/alldata
    @GetMapping(value = "/invoice/alldata", produces = "application/json")
    public List<Invoice> findAllData(){

        //check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Invoice");

        if (userPrivilege.getPrivi_select()) {
            return invoiceDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
        
    }

    // mapping for insert invoice data
	@PostMapping(value = "/invoice/insert")
	public String saveUserData(@RequestBody Invoice invoice) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Invoice");

		if (userPrivilege.getPrivi_insert()) {
			//duplicate check
	
			try {
				// LOYALTY POINTS REDEMPTION LOGIC - Must happen BEFORE saving the invoice
            if (invoice.getCustomer_id() != null && invoice.getRedeem_amount() != null && invoice.getRedeem_amount() > 0) {
                Customer customer = invoice.getCustomer_id();
                
                // Check if customer has enough loyalty points
                Integer currentPoints = customer.getLoyalty_points();
                if (currentPoints == null) {
                    currentPoints = 0;
                }
                
                if (currentPoints < invoice.getRedeem_amount()) {
                    return "Save not completed: Customer has insufficient loyalty points. Available: " + currentPoints + ", Required: " + invoice.getRedeem_amount();
                }
                
                // Deduct loyalty points
                customer.setLoyalty_points(currentPoints - invoice.getRedeem_amount());
                
                // Save updated customer BEFORE invoice to ensure data consistency
                customerDao.save(customer);
                
                // Update the invoice's customer reference to the persisted entity
                invoice.setCustomer_id(customer);
            }

				// set auto added data
				invoice.setAdded_datetime(LocalDateTime.now());
				invoice.setAdded_user_id(loggedUser.getId());
				invoice.setInvoice_code(invoiceDao.getNextCode());

				// save oparator
                for (InvoiceHasProduct ihp : invoice.getInvoiceHasProductList()) { //due to block inner form 
                    ihp.setInvoice_id(invoice);

                    // Update inventory quantity: deduct from oldest expire_date rows first
                    int quantityToDeduct = ihp.getQuantity() == null ? 0 : ihp.getQuantity();
                    List<Inventory> inventories = inventoryDao.findByProductOrderByExpireDateAsc(ihp.getProduct_id());
                    for (Inventory inv : inventories) {
                        if (quantityToDeduct <= 0) break;
                        Integer available = inv.getTotal_qty() == null ? 0 : inv.getTotal_qty();
                        if (available <= 0) continue;

                        if (available <= quantityToDeduct) {
                            // use up this inventory row
                            quantityToDeduct -= available;
                            inv.setTotal_qty(0);
                            // mark status = 2 when fully sold
                            inv.setInventory_status_id(inventoryStatusDao.getReferenceById(2));
                        } else {
                            // partially consume this inventory row
                            inv.setTotal_qty(available - quantityToDeduct);
                            quantityToDeduct = 0;
                        }
                        inventoryDao.save(inv);
                    }
                }
				
				Invoice savedInvoice = invoiceDao.save(invoice);

				// LOYALTY POINTS LOGIC
				if (savedInvoice.getCustomer_id() != null) {
					Customer customer = savedInvoice.getCustomer_id();
					
					// Calculate loyalty points (e.g., 1 point per 100 currency units)
					// OR 1% of net amount
					BigDecimal netAmount = savedInvoice.getNet_amount();
					if (netAmount != null) {
						// Example: 1 point for every 100 currency units
						// loyalty_points_to_add = netAmount / 100
						BigDecimal loyaltyRate = new BigDecimal("0.005");
						BigDecimal pointsToAddDecimal = netAmount.multiply(loyaltyRate);
						
						// Convert to integer (round down)
						int loyaltyPointsToAdd = pointsToAddDecimal.intValue();
						
						// Get current points (handle null)
						Integer currentPoints = customer.getLoyalty_points();
						if (currentPoints == null) {
							currentPoints = 0;
						}
						
						// Add new points
						customer.setLoyalty_points(currentPoints + loyaltyPointsToAdd);
						
						// Save updated customer
						customerDao.save(customer);
					}
				}


                // Create corresponding income record
                // Income income = new Income();
                // income.setInvoice_id(savedInvoice);
                // income.setTotal_amount(savedInvoice.getNet_amount());
                // income.setDate(savedInvoice.getAdded_datetime().toLocalDate());
                // income.setAdded_datetime(LocalDateTime.now());
                // income.setAdded_user_id(loggedUser.getId());
                // income.setIncome_status_id(incomeStatusDao.getReferenceById(1));
                // income.setIncome_number(incomeDao.getNextCode());
                // income.setCustomer_id(savedInvoice.getCustomer_id());
                
                // incomeDao.save(income);

                // dependances
				return "OK";
			} catch (Exception e) {
				return "Save not completed" + e.getMessage();
			}
		} else {
			return "Save not completed, No Permission!";
		}


	} 

    // mapping for invoice data
	@PutMapping(value = "/invoice/update")
	public String updateUserData(@RequestBody Invoice invoice) {

		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User loggedUser = userDao.getByUsename(auth.getName());
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Product");
		
		if (userPrivilege.getPrivi_update()) {
            //check id exists
            Integer invoiceId = invoice.getId();
            if (invoiceId == null) {
                return "Update not completed, no invoice id provided";
            }

            // Verify invoice exists
            if (!invoiceDao.existsById(invoiceId)) {
                return "Update not completed, invoice not found";
            }

            //duplicate check
			try {
				// set auto added data
				invoice.setUpdate_datetime(LocalDateTime.now());
				invoice.setUpdate_user_id(loggedUser.getId());

				// Update inventory quantities
				for (InvoiceHasProduct ihp : invoice.getInvoiceHasProductList()) { //due to block inner form 
					ihp.setInvoice_id(invoice);
				}
				invoiceDao.save(invoice);

				// Update inventory total_qty based on changes
				for (InvoiceHasProduct ihp : invoice.getInvoiceHasProductList()) {
					Inventory inventory = inventoryDao.findByProduct(ihp.getProduct_id());
					if (inventory != null) {
						inventory.setTotal_qty(inventory.getTotal_qty() + ihp.getQuantity());
						inventoryDao.save(inventory);
					}
				}

                // Update corresponding income record if exists
                // Income income = incomeDao.findActiveByInvoice_id(invoice);
                // if (income != null) {
                //     income.setTotal_amount(invoice.getNet_amount());
                //     income.setUpdate_datetime(LocalDateTime.now());
                //     income.setUpdate_user_id(loggedUser.getId());
                //     incomeDao.save(income);
                // }

				// dependances
				return "OK";
			} catch (Exception e) {
				return "Update not completed" + e.getMessage();
			}
		}else {
			return "Update not completed, No Permission!";
		}
	
	}

	// mapping for delete invoice data
	@DeleteMapping(value = "/invoice/delete") 
	public String deleteEmployeeData(@RequestBody Invoice invoice) {
        //check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //check id exists
        Integer invoiceId = invoice.getId();
        if (invoiceId == null) {
            return "Delete not completed, no invoice id provided";
        }

        // Verify invoice exists and get reference
        if (!invoiceDao.existsById(invoiceId)) {
            return "Delete not completed, invoice not found";
        }
        Invoice extProductById = invoiceDao.getReferenceById(invoiceId);
         
        try {
			// set auto added data
			extProductById.setDelete_datetime(LocalDateTime.now());
			extProductById.setDelete_user_id(userDao.getByUsename(auth.getName()).getId());
			extProductById.setInvoice_status_id(invoiceStatusDao.getReferenceById(2));

			// delete operator
			invoiceDao.save(extProductById);

            // Update corresponding income record if exists
            // Income income = incomeDao.findActiveByInvoice_id(extProductById);
            // if (income != null) {
            //     income.setDelete_datetime(LocalDateTime.now());
            //     income.setDelete_user_id(userDao.getByUsename(auth.getName()).getId());
            //     income.setIncome_status_id(incomeStatusDao.getReferenceById(2));
            //     incomeDao.save(income);
            // }
 
            // Update inventory total_qty
			for (InvoiceHasProduct ihp : extProductById.getInvoiceHasProductList()) {
				Inventory inventory = inventoryDao.findByProduct(ihp.getProduct_id());
				if (inventory != null) {
					inventory.setTotal_qty(inventory.getTotal_qty() - ihp.getQuantity());
					inventoryDao.save(inventory);
				}
			}

			// dependances
			return "OK";
		} catch (Exception e) {
			return "Delete not completed" + e.getMessage();
		}
	}


    @GetMapping(value = "/details/getbyinvoice/{invoiceID}", produces = "application/json")
    public Invoice findDetailsbyInvoiceID(@PathVariable("invoiceID") Integer invoiceID){
		
		//check logged user authorization
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Invoice");

			if (userPrivilege.getPrivi_select()) {
			return invoiceDao.findDetailsbyInvoiceID(invoiceID);
			} else {
				return null;
			}
    }


}
