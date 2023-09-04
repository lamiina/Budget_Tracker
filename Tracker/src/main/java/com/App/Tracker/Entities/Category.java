package com.App.Tracker.Entities;

import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.Set;


@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String description;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CatType type;

    @OneToMany(mappedBy = "category")
    private Set<Transactions> transaction;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CatType getType() {
        return type;
    }

    public void setType(CatType type) {
        this.type = type;
    }

    public Set<Transactions> getTransaction() {
        return transaction;
    }

    public void setTransaction(Set<Transactions> transaction) {
        this.transaction = transaction;
    }

    @Override
    public String toString() {
        return "Category{" +
                "id: " + id +
                ", type: '" + type + '\'' +
                ", transaction: " + transaction +
                '}';
    }
}