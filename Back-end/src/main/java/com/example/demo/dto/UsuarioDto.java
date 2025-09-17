package com.example.demo.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class UsuarioDto {

    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String cpf;
    private String senha;

}
