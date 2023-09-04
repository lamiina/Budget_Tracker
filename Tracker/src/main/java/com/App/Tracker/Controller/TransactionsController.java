package com.App.Tracker.Controller;

import com.App.Tracker.Entities.Transactions;
import com.App.Tracker.Repo.CategoryRepo;
import com.App.Tracker.Repo.TransactionsRepo;
import com.App.Tracker.Services.TransactionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transactions")
public class TransactionsController {

    private final TransactionsService transactionsService;

    public TransactionsController(TransactionsService transactionsService) {
        this.transactionsService = transactionsService;
    }

    @Autowired


    @GetMapping(value = "/")
    public String getPage() {
        return "This is the start of a new page";
    }

    @GetMapping
    public ResponseEntity<List<Transactions> >getTransactions() {
        return this.transactionsService.getAllTransactions();
    }

    @PostMapping
    public ResponseEntity<Transactions> addTrans(@RequestBody Transactions transaction) {

        return this.transactionsService.addTransaction(transaction);
    }

    @PutMapping(value = "{id}")
    public ResponseEntity<Transactions> updateTransaction(@PathVariable long id, @RequestBody Transactions transaction) {
        return this.transactionsService.updateTransaction(id, transaction);
    }


    @DeleteMapping(value = "{id}")
    public ResponseEntity<Object> deleteTransaction(@PathVariable long id) {
            return this.transactionsService.deleteTransaction(id);
    }

}
