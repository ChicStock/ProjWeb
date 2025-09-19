package com.example.demo.dto;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnderecoDTO {
    private Long id;
    private String rua;
    private String numero;
    private String cep;
    private String complemento;
    private String estado;
}
