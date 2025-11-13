package com.example.demo.dto;

import com.example.demo.model.PedidoStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoRequestDTO {
    private Double valorTotal;
    private LocalDateTime data;
    private PedidoStatus pedidoStatus;

    private Long lojaId;
    private Long usuarioId;
    private List<Long> produtosIds;
    private List<ProdutoQuantidadeDTO> produtos;
}
