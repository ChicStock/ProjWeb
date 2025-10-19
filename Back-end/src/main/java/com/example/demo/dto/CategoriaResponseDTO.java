package com.example.demo.dto;

import com.example.demo.model.CategoriaStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaResponseDTO {
    private Long id;
    private String nome;
    private String descricao;
    private CategoriaStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer totalProdutos;
}
