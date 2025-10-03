package com.example.demo.repository;

import com.example.demo.model.LojaModel;
import com.example.demo.model.StatusLoja;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LojaRepository extends JpaRepository<LojaModel, Long> {

    Optional<LojaModel> findByCnpj(String cnpj);
    boolean existsByCnpj(String cnpj);
    boolean existsByCnpjAndIdNot(String cnpj, Long id);

    List<LojaModel> findByStatusLoja(StatusLoja status, Sort sort);
    List<LojaModel> findByNomeContaining(String nome, Sort sort);

    @Query("SELECT l FROM LojaModel l WHERE l.statusLoja = 'ATIVO'")
    List<LojaModel> findLojasAtivas(Sort sort);

    @Query("SELECT COUNT(p) FROM LojaModel l LEFT JOIN l.produtos p WHERE l.id = :lojaId")
    Integer countProdutosByLojaId(Long lojaId);
}

