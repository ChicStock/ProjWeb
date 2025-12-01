package com.example.demo.dto;

import com.example.demo.model.StatusLoja;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LojaResponseDTO {
    private Long id;
    private String nome;
    private String descricao;
    private String endereco;
    private String telefone;
    private String cnpj;
    private String entrega;
    private String pagamento;
    private StatusLoja statusLoja;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer totalProdutos;
    private String imgUrl;
}