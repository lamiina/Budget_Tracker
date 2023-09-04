package com.App.Tracker.Repo;

import com.App.Tracker.Entities.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionsRepo extends JpaRepository<Transactions,Long> {
}
