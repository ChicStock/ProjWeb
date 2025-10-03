package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "loja")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LojaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_loja")
    private Long id;

    @NotBlank(message = "Nome da loja é obrigatório")
    @Size(max = 200, message = "Nome deve ter no máximo 200 caracteres")
    @Column(nullable = false)
    private String nome;

    @Size(max = 500, message = "Endereço deve ter no máximo 500 caracteres")
    private String endereco;

    @Pattern(regexp = "\\d{10,15}", message = "Telefone deve ter entre 10 e 15 dígitos")
    private String telefone;

    @Pattern(regexp = "\\d{14}", message = "CNPJ deve ter 14 dígitos")
    @Column(unique = true, length = 14)
    private String cnpj;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatusLoja statusLoja = StatusLoja.ATIVO;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relacionamento bidirecional com Produto
    @OneToMany(mappedBy = "loja", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProdutoModel> produtos;
}
