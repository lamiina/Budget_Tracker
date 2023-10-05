package com.App.Tracker.Controller;

import com.App.Tracker.Entities.Transactions;
import com.App.Tracker.Services.TransactionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionsController {
    private final TransactionsService transactionsService;

    @Autowired
    public TransactionsController(TransactionsService transactionsService) {
        this.transactionsService = transactionsService;
    }

    @GetMapping
    public ResponseEntity<List<Transactions>> getTransactions() {
        return this.transactionsService.getAllTransactions();
    }


    @GetMapping("/paged")
    public ResponseEntity<Page<Transactions>> getAllTransactionsPaged(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return transactionsService.getAllTransactionsPage(page, size);
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Transactions>> filterTransactions(
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "categoryType", required = false) String type,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {

        return transactionsService.filterTransactions(startDate, endDate, category, type, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transactions> getTransactionById(@PathVariable long id) {
        return this.transactionsService.getTransactionById(id);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Transactions> getTransaction(@PathVariable long id) {
        return this.transactionsService.getTransactionsDTOById(id);
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

    @DeleteMapping( value = "/multiDelete")
    public ResponseEntity<Object> deleteMultiple(@RequestBody List<Long> ids) {
        return this.transactionsService.deleteMultipleTransactions(ids);
    }

}
