package com.App.Tracker.Controller;

import com.App.Tracker.Entities.Category;
import com.App.Tracker.Entities.Transactions;
import com.App.Tracker.Services.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {


    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getCategories() {
        return categoryService.getCategories();
    }

    @PostMapping
    public ResponseEntity<Category> saveCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    @PutMapping(value = "{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable long id, @RequestBody Category category) {
        return categoryService.updateCategory(id, category);
    }

    @DeleteMapping(value = "{id}")
    public ResponseEntity<Category> deleteCategory(@PathVariable long id) {
            return categoryService.deleteCategory(id);

    }
}
