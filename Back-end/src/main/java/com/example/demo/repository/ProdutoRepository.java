package com.example.demo.repository;

import com.example.demo.model.ProdutoModel;
import com.example.demo.model.ProdutoStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<ProdutoModel, Long> {

    List<ProdutoModel> findByStatus(ProdutoStatus status, Sort sort);
    Page<ProdutoModel> findByStatus(ProdutoStatus status, Pageable pageable);

    List<ProdutoModel> findAllByStatusOrderByPrecoAscNomeAsc(ProdutoStatus status);
    List<ProdutoModel> findAllByStatusOrderByPrecoDescNomeAsc(ProdutoStatus status);

    List<ProdutoModel> findByCategoriaIdAndStatus(Long categoriaId, ProdutoStatus status, Sort sort);
    List<ProdutoModel> findByLojaIdAndStatus(Long lojaId, ProdutoStatus status, Sort sort);

    Page<ProdutoModel> findByCategoriaIdAndStatus(Long categoriaId, ProdutoStatus status, Pageable pageable);
    Page<ProdutoModel> findByLojaIdAndStatus(Long lojaId, ProdutoStatus status, Pageable pageable);

    List<ProdutoModel> findByNomeContainingAndStatus(String nome, ProdutoStatus status, Sort sort);

    List<ProdutoModel> findByPrecoBetweenAndStatus(BigDecimal precoMin, BigDecimal precoMax, ProdutoStatus status, Sort sort);

    @Query("SELECT p FROM ProdutoModel p WHERE " +
            "(:nome IS NULL OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
            "(:categoriaId IS NULL OR p.categoria.id = :categoriaId) AND " +
            "(:lojaId IS NULL OR p.loja.id = :lojaId) AND " +
            "(:precoMin IS NULL OR p.preco >= :precoMin) AND " +
            "(:precoMax IS NULL OR p.preco <= :precoMax) AND " +
            "p.status = 'ATIVO'")
    Page<ProdutoModel> findProdutosComFiltros(@Param("nome") String nome,
                                              @Param("categoriaId") Long categoriaId,
                                              @Param("lojaId") Long lojaId,
                                              @Param("precoMin") BigDecimal precoMin,
                                              @Param("precoMax") BigDecimal precoMax,
                                              Pageable pageable);


    Long countByStatus(ProdutoStatus status);
    Long countByCategoriaIdAndStatus(Long categoriaId, ProdutoStatus status);
    Long countByLojaIdAndStatus(Long lojaId, ProdutoStatus status);

    boolean existsByNomeAndStatus(String nome, ProdutoStatus status);
}


