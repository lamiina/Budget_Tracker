package com.App.Tracker.Repo;

import com.App.Tracker.Entities.CatType;
import com.App.Tracker.Entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepo extends JpaRepository<Category,Long> {
    Optional<Category> findByDescriptionAndType(String description, CatType type);

    Optional<Category> findByDescription(Category category);
}
