package com.App.Tracker.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.Set;


@Entity
@Table(name = "categories")
@JsonIgnoreProperties("transactions")
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
    private Set<Transactions> transactions;

    public Category() {
    }

    public Category(String description, CatType type) {
        this.description = description;
        this.type = type;
    }

    public Category(String description, CatType type, Set<Transactions> transactions) {
        this.description = description;
        this.type = type;
        this.transactions = transactions;
    }

    public Category(long id, String description, CatType type, Set<Transactions> transactions) {
        this.id = id;
        this.description = description;
        this.type = type;
        this.transactions = transactions;
    }

    public Category(long id, String description, CatType type) {
        this.id = id;
        this.description = description;
        this.type = type;
    }

    public Category(long id, String description, Set<Transactions> transactions) {
        this.id = id;
        this.description = description;
        this.transactions = transactions;
    }

    public Category(long id, CatType type, Set<Transactions> transactions) {
        this.id = id;
        this.type = type;
        this.transactions = transactions;
    }

    public Category(String description, Set<Transactions> transactions) {
        this.description = description;
        this.transactions = transactions;
    }

    public Category(long id, String description) {
        this.id = id;
        this.description = description;
    }

    public Category(long id, CatType type) {
        this.id = id;
        this.type = type;
    }

    public Category(CatType type, Set<Transactions> transactions) {
        this.type = type;
        this.transactions = transactions;
    }

    public Category(long id) {
        this.id = id;
    }


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

    public Set<Transactions> getTransactions() {
        return transactions;
    }

    public void setTransactions(Set<Transactions> transactions) {
        this.transactions = transactions;
    }

    @Override
    public String toString() {
        return "Category{" +
                "id: " + id +
                ", type: '" + type + '\'' +
                ", transaction: " + transactions +
                '}';
    }
}