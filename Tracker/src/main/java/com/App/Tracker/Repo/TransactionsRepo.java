package com.App.Tracker.Repo;

import com.App.Tracker.Entities.Transactions;
import com.App.Tracker.Entities.TransactionsDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TransactionsRepo extends JpaRepository<Transactions,Long> {
    @Query("SELECT NEW com.App.Tracker.Entities.TransactionsDTO(t.id, t.date, t.details, t.amount, t.category) FROM Transactions t WHERE t.id = :id")
    TransactionsDTO getTransactionsDTOById(@Param("id") long id);
    @Query("SELECT NEW com.App.Tracker.Entities.TransactionsDTO(t.id, t.date, t.details, t.amount, t.category) FROM Transactions t")
    List<TransactionsDTO> getAllTransactionsDTOs();
}
