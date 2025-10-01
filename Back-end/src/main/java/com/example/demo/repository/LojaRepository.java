package com.example.demo.repository;

import com.example.demo.model.LojaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LojaRepository extends JpaRepository<LojaModel, Long> {
}
