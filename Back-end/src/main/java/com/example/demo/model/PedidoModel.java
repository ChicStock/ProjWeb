package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class PedidoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long id;

    @Column(nullable = false)
    private Double valorTotal;

    @Column(nullable = false)
    private PedidoStatus pedidoStatus;

    @Column(nullable = false)
    private LocalDateTime data;

    @Column(nullable = false)
    @ManyToMany
    private ProdutoModel produtoModel;

    @Column(nullable = false)
    @ManyToMany
    private LojaModel lojaModel;

    @Column(nullable = false)
    @OneToMany
    private UsuarioModel usuarioModel;

}
