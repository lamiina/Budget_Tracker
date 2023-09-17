package com.App.Tracker.Repo;

import com.App.Tracker.Entities.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionsRepo extends JpaRepository<Transactions,Long> {
}
