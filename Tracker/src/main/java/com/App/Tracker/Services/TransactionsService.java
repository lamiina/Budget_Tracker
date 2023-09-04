package com.App.Tracker.Services;

import com.App.Tracker.Entities.Category;
import com.App.Tracker.Entities.Transactions;
import com.App.Tracker.Exceptions.NotFoundException;
import com.App.Tracker.Repo.CategoryRepo;
import com.App.Tracker.Repo.TransactionsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionsService {
    private final TransactionsRepo transactionsRepo;
    private CategoryRepo categoryRepo;

    @Autowired
    public TransactionsService(TransactionsRepo transactionsRepo) {
        this.transactionsRepo = transactionsRepo;
    }

    public ResponseEntity<List<Transactions>> getAllTransactions() {
        return ResponseEntity.ok(this.transactionsRepo.findAll());
    }

    public ResponseEntity<Transactions> addTransaction(Transactions transaction) {
        Optional<Category> category = this.categoryRepo.findByDescription(transaction.getCategory());
        if (!category.isPresent()) {
            throw new NotFoundException("Category " + category + " does not exist");
        }

        return ResponseEntity.ok(transactionsRepo.save(transaction));
    }


    public ResponseEntity<Transactions> updateTransaction(long id, Transactions transaction) {
        Optional<Transactions> foundTransaction = this.transactionsRepo.findById(id);

        if (!foundTransaction.isPresent()) {
            throw new NotFoundException("Transaction with id " + id + " doesn't exist");
        }

        Transactions updateTransaction = foundTransaction.get();
        ;
        if (transaction.getAmount() != 0.00) {
            updateTransaction.setAmount(transaction.getAmount());
        }
        if (transaction.getCategory() != null) {
            updateTransaction.setCategory(transaction.getCategory());
        }
        if (transaction.getDate() != null) {
            updateTransaction.setDate(transaction.getDate());
        }
        if (transaction.getDetails() != null) {
            updateTransaction.setDetails(transaction.getDetails());
        }

        return ResponseEntity.ok(transactionsRepo.save(updateTransaction));
    }


    public ResponseEntity<Object> deleteTransaction(long id) {

        Optional<Transactions> optionalTransaction = transactionsRepo.findById(id);

        if (!optionalTransaction.isPresent()) {
            throw new NotFoundException("Transaction with the id " + id + " does not exist");
        }

        this.transactionsRepo.deleteById(id);

        return new ResponseEntity <>(HttpStatus.NO_CONTENT);
    }


}
