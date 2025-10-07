package com.example.demo.dto;

import com.example.demo.model.ProdutoStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoResponseDTO {
    private Long id;
    private String nome;
    private BigDecimal preco;
    private String descricao;
    private Integer quantidade;
    private String imgUrl;
    private ProdutoStatus status;

    // Dados da categoria
    private Long categoriaId;
    private String nomeCategoria;

    // Dados da loja
    private Long lojaId;
    private String nomeLoja;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
