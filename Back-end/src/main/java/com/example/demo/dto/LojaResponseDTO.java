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
    private String endereco;
    private String telefone;
    private String cnpj;
    private StatusLoja status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer totalProdutos;
}
