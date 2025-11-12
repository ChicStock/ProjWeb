package com.example.demo.repository;

import com.example.demo.model.CategoriaModel;
import com.example.demo.model.CategoriaStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaModel, Long> {

    List<CategoriaModel> findByStatus(CategoriaStatus status, Sort sort);
    List<CategoriaModel> findByNomeContaining(String nome, Sort sort);

    @Query("SELECT c FROM CategoriaModel c WHERE c.status = 'ATIVO'")
    List<CategoriaModel> findCategoriasAtivas(Sort sort);

    @Query("SELECT COUNT(p) FROM CategoriaModel c LEFT JOIN c.produtos p WHERE c.id = :categoriaId")
    Integer countProdutosByCategoriaId(Long categoriaId);

    boolean existsByNome(String nome);
}
