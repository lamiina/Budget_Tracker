package com.App.Tracker.Services;

import com.App.Tracker.Entities.CatType;
import com.App.Tracker.Entities.Category;
import com.App.Tracker.Entities.Transactions;
import com.App.Tracker.Exceptions.NotFoundException;
import com.App.Tracker.Repo.CategoryRepo;
import com.App.Tracker.Repo.TransactionsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionsService {
    private final TransactionsRepo transactionsRepo;
    private final CategoryRepo categoryRepo;

    @Autowired
    public TransactionsService(TransactionsRepo transactionsRepo, CategoryRepo categoryRepo) {
        this.transactionsRepo = transactionsRepo;
        this.categoryRepo = categoryRepo;
    }


    public ResponseEntity<List<Transactions>> getAllTransactions() {
        return ResponseEntity.ok(this.transactionsRepo.findAll());
    }

    public ResponseEntity<Transactions> getTransactionById(long id) {
        Transactions transaction = transactionsRepo.getById(id);

        return ResponseEntity.ok(transaction);
    }
    public ResponseEntity<Page<Transactions>> getAllTransactionsPage(int page, int size){
        PageRequest pr = PageRequest.of(page,size);
        Page<Transactions> transactionsPage = transactionsRepo.findAll(pr);
        return ResponseEntity.ok(transactionsPage);
    }
    public ResponseEntity<Page<Transactions>> filterTransactions(
            String startDate,
            String endDate,
            String categoryName,
            String type,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());

        Specification<Transactions> spec = Specification.where(null);

        // Check if any filter is applied, and if not, return all transactions
        if (startDate == null && endDate == null && categoryName == null && type == null) {
            Page<Transactions> allTransactions = transactionsRepo.findAll(pageable);
            return ResponseEntity.ok(allTransactions);
        }

        if (startDate != null) {
            spec = spec.and((root, query, builder) -> builder.greaterThanOrEqualTo(root.get("date"), startDate));
        }

        if (endDate != null) {
            spec = spec.and((root, query, builder) -> builder.lessThanOrEqualTo(root.get("date"), endDate));
        }

        if (categoryName != null) {
            spec = spec.and((root, query, builder) -> builder.equal(root.get("category").get("description"), categoryName));
        }

        if (type != null) {
            CatType enumCategoryType = CatType.valueOf(type); // Assuming CatType is the enum class
            spec = spec.and((root, query, builder) -> builder.equal(root.get("category").get("type"), enumCategoryType));
        }

        Page<Transactions> filteredTransactions = transactionsRepo.findAll(spec, pageable);

        if (filteredTransactions.isEmpty()) {
            throw new NotFoundException("No transactions that match the specified filter criteria were found.");
        }

        return ResponseEntity.ok(filteredTransactions);
    }

    public ResponseEntity<Transactions> getTransactionsDTOById(long id) {
        Transactions transaction = transactionsRepo.findById(id).orElse(null);


        return ResponseEntity.ok(transaction);
    }

    public ResponseEntity<Transactions> addTransaction(Transactions transaction) {
        Optional<Category> catOpt = this.categoryRepo.findById(transaction.getCategory().getId());

        if( !catOpt.isPresent()){
            throw new NotFoundException("Category "+ catOpt +" does not exist");
        }
        Category category =catOpt.get();
        transaction.setCategory(category);
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

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    public ResponseEntity<Object> deleteMultipleTransactions( List<Long> ids){
        List<Long> deletedIds = new ArrayList<>();

        for( Long id : ids){
            this.transactionsRepo.deleteById(id);
            deletedIds.add(id);
        }

        if(deletedIds.isEmpty()){
            throw new NotFoundException("Invalid transactions selected");
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
