package com.example.demo.dto;

import java.util.List;

public record DashboardDTO(
        Long idLoja,
        String nomeLoja,
        Double faturamentoTotal,
        Integer pedidosPagos,
        Integer pedidosPendentes,
        List<GraficoVendasDTO> grafico,
        List<PedidoResponseDTO> ultimosPedidos,
        List<ProdutoEstoqueDTO> estoque
) {

    public record GraficoVendasDTO(String nome, Long vendas) {}

    public record ProdutoEstoqueDTO(
            Long id,
            String nome,
            String categoria,
            Double valor,
            Integer quantidade,
            String descricao
    ) {}
}