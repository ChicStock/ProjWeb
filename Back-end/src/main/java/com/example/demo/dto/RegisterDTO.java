package com.example.demo.dto;

import com.example.demo.model.enums.UserRole;

public record RegisterDTO(String nome, String sobrenome, String email,String telefone,String cpf, String senha, UserRole role) {
}
