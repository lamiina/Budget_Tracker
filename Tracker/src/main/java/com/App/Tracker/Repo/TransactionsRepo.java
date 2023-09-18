package com.App.Tracker.Repo;

import com.App.Tracker.Entities.Transactions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;

public interface TransactionsRepo extends JpaRepository<Transactions, Long> {

        Page<Transactions> findAll(Specification<Transactions> spec, Pageable pageable);

}
