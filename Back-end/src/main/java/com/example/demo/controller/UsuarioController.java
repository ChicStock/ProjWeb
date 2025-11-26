package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // IMPORTANTE
import org.springframework.security.core.userdetails.UserDetails; // IMPORTANTE
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuários", description = "Gerenciamento de usuários")
public class UsuarioController {

    private final UsuarioService usuarioService;


    @GetMapping("/me")
    @Operation(summary = "Obter dados do usuário logado (Perfil)")
    public ResponseEntity<UsuarioResponseDTO> obterMeuPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        UsuarioResponseDTO response = usuarioService.buscarPerfil(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    @Operation(summary = "Atualizar dados do usuário logado e endereço")
    public ResponseEntity<UsuarioResponseDTO> atualizarMeuPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UsuarioUpdateDTO dados) {

        UsuarioResponseDTO response = usuarioService.atualizarPerfil(userDetails.getUsername(), dados);
        return ResponseEntity.ok(response);
    }


    @PostMapping
    @Operation(summary = "Criar novo usuário")
    public ResponseEntity<UsuarioResponseDTO> criarUsuario(@RequestBody @Valid UsuarioRequestDTO requestDTO) {
        try {
            UsuarioResponseDTO usuarioCriado = usuarioService.criarUsuario(requestDTO);
            URI location = URI.create("/api/v1/usuarios/" + usuarioCriado.getId());
            return ResponseEntity.created(location).body(usuarioCriado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    @Operation(summary = "Listar todos os usuários")
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
        List<UsuarioResponseDTO> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar usuário por ID")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        Optional<UsuarioResponseDTO> usuario = usuarioService.buscarPorId(id);
        return usuario.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar usuário parcialmente (Admin ou ID específico)")
    public ResponseEntity<UsuarioResponseDTO> atualizarParcialmente(
            @PathVariable Long id,
            @RequestBody @Valid UsuarioUpdateDTO updateDTO) {
        try {
            Optional<UsuarioResponseDTO> usuarioAtualizado = usuarioService.atualizarParcialmente(id, updateDTO);
            return usuarioAtualizado.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar usuário")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        boolean deletado = usuarioService.deletar(id);
        return deletado ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}