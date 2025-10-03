package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LojaRequestDTO {

    @NotBlank(message = "Nome da loja é obrigatório")
    @Size(max = 200, message = "Nome deve ter no máximo 200 caracteres")
    private String nome;

    @Size(max = 500, message = "Endereço deve ter no máximo 500 caracteres")
    private String endereco;

    @Pattern(regexp = "\\d{10,15}", message = "Telefone deve ter entre 10 e 15 dígitos")
    private String telefone;

    @Pattern(regexp = "\\d{14}", message = "CNPJ deve ter 14 dígitos")
    private String cnpj;
}
