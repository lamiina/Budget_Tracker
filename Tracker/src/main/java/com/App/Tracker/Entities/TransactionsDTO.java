package com.App.Tracker.Entities;

public class TransactionsDTO {
    private long id;
    private String date;
    private String details;
    private double amount;
    private Category category;

    public TransactionsDTO() {}
    // Constructor with all fields
    public TransactionsDTO(long id, String date, String details, double amount, Category category) {
        this.id = id;
        this.date = date;
        this.details = details;
        this.amount = amount;
        this.category = category;
    }

    // Constructor without the ID field (for cases where ID is not available)
    public TransactionsDTO(String date, String details, double amount, Category category) {
        this.date = date;
        this.details = details;
        this.amount = amount;
        this.category = category;
    }

    // Constructor without the Category field (for cases where Category is not available)
    public TransactionsDTO(long id, String date, String details, double amount) {
        this.id = id;
        this.date = date;
        this.details = details;
        this.amount = amount;
    }

    // Constructor without the ID and Category fields
    public TransactionsDTO(String date, String details, double amount) {
        this.date = date;
        this.details = details;
        this.amount = amount;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
