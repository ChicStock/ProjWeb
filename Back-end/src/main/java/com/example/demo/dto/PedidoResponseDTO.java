package com.example.demo.dto;

import com.example.demo.model.PedidoStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoResponseDTO {
    private Long id;
    private Double valorTotal;
    private PedidoStatus pedidoStatus;
    private LocalDateTime data;
    private String nomeCliente;
    private String telefoneCliente;
    private String resumoItens;
}