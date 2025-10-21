package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.LojaService;
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
@RequestMapping("/api/v1/lojas")
@RequiredArgsConstructor
@Tag(name = "Lojas", description = "Gerenciamento de lojas")
public class LojaController {

    private final LojaService lojaService;

    @PostMapping
    @Operation(summary = "Criar nova loja")
    public ResponseEntity<LojaResponseDTO> criarLoja(@RequestBody @Valid LojaRequestDTO requestDTO) {
        try {
            LojaResponseDTO loja = lojaService.criarLoja(requestDTO);
            URI location = URI.create("/api/v1/lojas/" + loja.getId());
            return ResponseEntity.created(location).body(loja);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    @Operation(summary = "Listar lojas ativas")
    public ResponseEntity<List<LojaResponseDTO>> listarLojasAtivas() {
        List<LojaResponseDTO> lojas = lojaService.listarTodasAtivas();
        return ResponseEntity.ok(lojas);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar loja por ID")
    public ResponseEntity<LojaResponseDTO> buscarPorId(@PathVariable Long id) {
        Optional<LojaResponseDTO> loja = lojaService.buscarPorId(id);
        return loja.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar loja")
    public ResponseEntity<LojaResponseDTO> atualizarLoja(
            @PathVariable Long id,
            @RequestBody @Valid LojaRequestDTO requestDTO) {
        try {
            Optional<LojaResponseDTO> atualizada = lojaService.atualizarLoja(id, requestDTO);
            return atualizada.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/desativar")
    @Operation(summary = "Desativar loja")
    public ResponseEntity<Void> desativarLoja(@PathVariable Long id) {
        boolean desativada = lojaService.desativarLoja(id);
        return desativada ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
