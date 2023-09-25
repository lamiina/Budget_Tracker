package com.App.Tracker.Controller;

import com.App.Tracker.Entities.Category;

import com.App.Tracker.Services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {


    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getCategories() {
        return categoryService.getCategories();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Category>> getFilteredCategories(
            @RequestParam(name = "description", required = false) String description,
            @RequestParam(name = "type", required = false) String type) {
        return categoryService.filterCategories(description, type);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable long id){
        return categoryService.getCategoryById(id);
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
