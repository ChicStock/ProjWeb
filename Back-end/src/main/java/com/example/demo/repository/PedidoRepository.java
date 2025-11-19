package com.example.demo.repository;

import com.example.demo.model.PedidoModel;
import com.example.demo.model.PedidoStatus; // Verifique se o import está correto
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PedidoRepository extends JpaRepository<PedidoModel, Long> {

    @Query("SELECT SUM(p.valorTotal) FROM PedidoModel p WHERE p.loja.id = :lojaId")
    Double somarFaturamentoPorLoja(@Param("lojaId") Long lojaId);

    Long countByLojaIdAndPedidoStatus(Long lojaId, PedidoStatus pedidoStatus);

    @Query("SELECT p FROM PedidoModel p WHERE p.loja.id = :lojaId ORDER BY p.data DESC")
    List<PedidoModel> buscarUltimosPedidos(@Param("lojaId") Long lojaId, Pageable pageable);

    @Query("SELECT prod.nome, COUNT(prod) FROM PedidoModel p JOIN p.produtos prod WHERE p.loja.id = :lojaId GROUP BY prod.nome ORDER BY COUNT(prod) DESC")
    List<Object[]> buscarProdutosMaisVendidos(@Param("lojaId") Long lojaId);
}