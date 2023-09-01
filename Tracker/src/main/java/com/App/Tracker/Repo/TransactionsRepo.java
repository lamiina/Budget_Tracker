package com.App.Tracker.Repo;

import com.App.Tracker.Models.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionsRepo extends JpaRepository<Transactions,Long> {
}
