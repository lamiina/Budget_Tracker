package com.App.Tracker.Services;

import com.App.Tracker.Entities.CatType;
import com.App.Tracker.Entities.Category;
import com.App.Tracker.Entities.Transactions;
import com.App.Tracker.Exceptions.ConflictException;
import com.App.Tracker.Exceptions.NotFoundException;
import com.App.Tracker.Repo.CategoryRepo;
import com.App.Tracker.Repo.TransactionsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class CategoryService {

    private final TransactionsRepo transactionsRepo;
    private final CategoryRepo categoryRepo;

    @Autowired
    public CategoryService(TransactionsRepo transactionsRepo, CategoryRepo categoryRepo) {
        this.transactionsRepo = transactionsRepo;
        this.categoryRepo = categoryRepo;
    }

    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryRepo.findAll());
    }

    public ResponseEntity<Category> getCategory(long id) {
        Optional<Category> cat = this.categoryRepo.findById(id);
        if (!cat.isPresent()) {
            throw new NotFoundException("Category with id " + id + " does not exist");
        }
        return ResponseEntity.ok(cat.get());
    }

    public ResponseEntity<Category> saveCategory(Category category) {
        Optional<Category> cat = this.categoryRepo.findByDescriptionAndType(category.getDescription(), category.getType());

        if (cat.isPresent()) {
            throw new ConflictException("A category with the " + category.getDescription()
                    + "description and " + category.getType().getValue() + " type already exists");
        }
        String typeCheck = category.getType().getValue();
        if (!CatType.typeExists(typeCheck)) {
            throw new NotFoundException("Category type " + typeCheck + "does not exist");
        }
        return new ResponseEntity<>(this.categoryRepo.save(category), HttpStatus.CREATED);
    }


    public ResponseEntity<Category> updateCategory(long id, Category category) {
        Optional<Category> foundCategory = this.categoryRepo.findById(id);

        if (!foundCategory.isPresent()) {
            throw new NotFoundException("category with id " + " does not exist");
        }

        Category updateCategory = foundCategory.get();

        if (category.getDescription() != null) {
            updateCategory.setDescription(category.getDescription());
        }
        if (category.getType() != null) {
            updateCategory.setType(category.getType());
        }

        // Update related Transactions if needed
        if (category.getTransactions() != null) {
            for (Transactions transaction : category.getTransactions()) {
                transaction.setCategory(updateCategory);
                transactionsRepo.save(transaction);
            }
        }
        return ResponseEntity.ok(categoryRepo.save(updateCategory));
    }


    public ResponseEntity<Category> deleteCategory(long id) throws NotFoundException {

        Optional<Category> optionalCategory = this.categoryRepo.findById(id);

        if (!optionalCategory.isPresent()) {
            throw new NotFoundException("Category with id " + id + " does not exist");
        }

        Category category = optionalCategory.get();

        // Delete related transactions first
        Set<Transactions> transactions = category.getTransactions();
        if (transactions != null) {
            transactionsRepo.deleteAll(transactions);

        }
        categoryRepo.delete(category);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }
}
