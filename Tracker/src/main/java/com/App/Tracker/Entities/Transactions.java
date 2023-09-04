package com.App.Tracker.Entities;


import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
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
