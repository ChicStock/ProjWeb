package com.example.demo.dto;

import com.example.demo.model.StatusUsuario;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String sobrenome;
    private String email;
    private String cpf;
    private String telefone;
    private StatusUsuario status;
}
