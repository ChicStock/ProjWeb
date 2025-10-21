package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoUpdateDTO {

    @Size(max = 200, message = "Nome deve ter no máximo 200 caracteres")
    private String nome;

    @Positive(message = "Preço deve ser positivo")
    @DecimalMin(value = "0.01", message = "Preço deve ser maior que 0")
    private BigDecimal preco;

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String descricao;

    @PositiveOrZero(message = "Quantidade não pode ser negativa")
    private Integer quantidade;

    @Size(max = 500, message = "URL da imagem deve ter no máximo 500 caracteres")
    private String imgUrl;

    private Long categoriaId;
    private Long lojaId;
}
