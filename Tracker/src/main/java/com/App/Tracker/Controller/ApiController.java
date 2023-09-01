package com.App.Tracker.Controller;

import com.App.Tracker.Models.Category;
import com.App.Tracker.Models.Transactions;
import com.App.Tracker.Repo.CategoryRepo;
import com.App.Tracker.Repo.TransactionsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class ApiController {
    @Autowired
    private TransactionsRepo transactionsRepo;
    @Autowired
    private CategoryRepo categoryRepo;

    @GetMapping(value = "/")
    public String getPage() {
        return "This is the start of a new page";
    }

    @GetMapping(value = "/transactions")
    public List<Transactions> getTransactions() {
        return transactionsRepo.findAll();
    }

    @GetMapping(value = "/categories")
    public List<Category> getCategories() {
        return categoryRepo.findAll();
    }

    @PostMapping(value = "/save")
    public String saveTransaction(@RequestBody Transactions transaction) {
        transactionsRepo.save(transaction);
        return "Transaction saved successfully";
    }

    @PostMapping(value = "/create")
    public String saveCategory(@RequestBody Category category) {
        categoryRepo.save(category);
        return "Category created successfully";
    }

    @PutMapping(value = "updateTransaction/{id}")
    public String updateTransaction(@PathVariable long id, @RequestBody Transactions transaction) {
        Transactions updateTransaction = transactionsRepo.findById(id).get();
        updateTransaction.setAmount(transaction.getAmount());
        updateTransaction.setCategory(transaction.getCategory());
        updateTransaction.setDate(transaction.getDate());
        updateTransaction.setDetails(transaction.getDetails());
        transactionsRepo.save(updateTransaction);
        return "Your transaction has been updated";

    }

    @PutMapping(value = "updateCategory/{id}")
    public String updateCategory(@PathVariable long id, @RequestBody Category category) {
        Category updatedCategory = categoryRepo.findById(id).orElse(null);

        if (updatedCategory == null) {
            return "Category not found";
        }

        updatedCategory.setDescription(category.getDescription());
        updatedCategory.setType(category.getType()); // Set the enum value

        // Update related Transactions if needed
        if (category.getTransaction() != null) {
            for (Transactions transaction : category.getTransaction()) {
                transaction.setCategory(updatedCategory);
                transactionsRepo.save(transaction);
            }
        }

        categoryRepo.save(updatedCategory);
        return "The category has been updated";
    }

    @DeleteMapping(value = "/delete/{id}")
    public String deleteTransaction(@PathVariable long id) {

        Optional<Transactions> optionalTransaction = transactionsRepo.findById(id);

        if (optionalTransaction.isPresent()) {

            Transactions transaction = optionalTransaction.get();
            transactionsRepo.delete(transaction);

            return "Transaction with the ID " + id + " deleted successfully";
        } else {
            return "Transaction not found";
        }
    }

    @DeleteMapping(value = "/erase/{id}")
    public String deleteCategory(@PathVariable long id) {

        Optional<Category> optionalCategory = categoryRepo.findById(id);

        if (optionalCategory.isPresent()) {
            Category category = optionalCategory.get();

            // Delete related transactions first
            Set<Transactions> transactions = category.getTransaction();
            if (transactions != null) {
                transactionsRepo.deleteAll(transactions);
            }

            categoryRepo.delete(category);

            return "Category with the ID " + id + " and all related transactions erased successfully";
        } else {
            return "Category not found";
        }
    }
}
