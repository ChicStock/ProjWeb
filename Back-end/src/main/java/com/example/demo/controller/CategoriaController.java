package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/categorias")
@RequiredArgsConstructor
@Tag(name = "Categorias", description = "Gerenciamento de categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @PostMapping
    @Operation(summary = "Criar nova categoria")
    public ResponseEntity<CategoriaResponseDTO> criarCategoria(@RequestBody @Valid CategoriaRequestDTO requestDTO) {
        CategoriaResponseDTO categoria = categoriaService.criarCategoria(requestDTO);
        URI location = URI.create("/api/v1/categorias/" + categoria.getId());
        return ResponseEntity.created(location).body(categoria);
    }

    @GetMapping
    @Operation(summary = "Listar categorias ativas")
    public ResponseEntity<List<CategoriaResponseDTO>> listarCategoriasAtivas() {
        List<CategoriaResponseDTO> categorias = categoriaService.listarTodasAtivas();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar categoria por ID")
    public ResponseEntity<CategoriaResponseDTO> buscarPorId(@PathVariable Long id) {
        Optional<CategoriaResponseDTO> categoria = categoriaService.buscarPorId(id);
        return categoria.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar categoria")
    public ResponseEntity<CategoriaResponseDTO> atualizarCategoria(
            @PathVariable Long id,
            @RequestBody @Valid CategoriaRequestDTO requestDTO) {
        Optional<CategoriaResponseDTO> atualizada = categoriaService.atualizarCategoria(id, requestDTO);
        return atualizada.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/desativar")
    @Operation(summary = "Desativar categoria")
    public ResponseEntity<Void> desativarCategoria(@PathVariable Long id) {
        boolean desativada = categoriaService.desativarCategoria(id);
        return desativada ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
