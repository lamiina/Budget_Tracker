package com.App.Tracker.Entities;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
//@JsonIgnoreProperties({"category"})
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class Transactions {

    @Id
    @GeneratedValue( strategy =  GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id", referencedColumnName = "id", nullable = false)
    private Category category;

    @Column(name = "date", nullable = false)
    private String date;

    @Column(name = "details")
    private String details;

    @Column(name = "amount", nullable = false)
    private double amount;

    public Transactions() {
    }

    public Transactions(Category category, String date, double amount) {
        this.category = category;
        this.date = date;
        this.amount = amount;
    }

    public Transactions(Category category, String date, String details, double amount) {
        this.category = category;
        this.date = date;
        this.details = details;
        this.amount = amount;
    }

    public Transactions(long id, Category category, String date, double amount) {
        this.id = id;
        this.category = category;
        this.date = date;
        this.amount = amount;
    }

    public Transactions(long id, Category category, String date, String details, double amount) {
        this.id = id;
        this.category = category;
        this.date = date;
        this.details = details;
        this.amount = amount;
    }

    public Transactions(Category category, String date, String details) {
        this.category = category;
        this.date = date;
        this.details = details;
    }

    public Transactions(long id, Category category, String date, String details) {
        this.id = id;
        this.category = category;
        this.date = date;
        this.details = details;
    }

    public Transactions(Category category, String date) {
        this.category = category;
        this.date = date;
    }

    public Transactions(long id, Category category, String date) {
        this.id = id;
        this.category = category;
        this.date = date;
    }

    public Transactions(String date, double amount) {
        this.date = date;
        this.amount = amount;
    }

    public Transactions(String date, String details, double amount) {
        this.date = date;
        this.details = details;
        this.amount = amount;
    }

    public Transactions(long id, String date, double amount) {
        this.id = id;
        this.date = date;
        this.amount = amount;
    }

    public Transactions(long id, String date, String details, double amount) {
        this.id = id;
        this.date = date;
        this.details = details;
        this.amount = amount;
    }

    public Transactions(String date, String details) {
        this.date = date;
        this.details = details;
    }

    public Transactions(long id, String date, String details) {
        this.id = id;
        this.date = date;
        this.details = details;
    }

    public Transactions(String date) {
        this.date = date;
    }

    public Transactions(long id, String date) {
        this.id = id;
        this.date = date;
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }


    @Override
    public String toString() {
        return "Transactions{" +
                "id: " + id +
                ", category: " + category +
                ", date: '" + date + '\'' +
                ", details: '" + details + '\'' +
                ", amount: " + amount +
                '}';
    }
}
