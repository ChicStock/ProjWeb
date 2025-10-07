package com.example.demo.controller; // Corrigido o package

import com.example.demo.dto.*;
import com.example.demo.service.UsuarioService; // Corrigido o import
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
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuários", description = "Gerenciamento de usuários")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    @Operation(summary = "Criar novo usuário")
    public ResponseEntity<UsuarioResponseDTO> criarUsuario(
            @RequestBody @Valid UsuarioRequestDTO requestDTO) {
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
package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.UsuarioService; // Corrigido o import
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    @Operation(summary = "Criar novo usuário")
    public ResponseEntity<UsuarioResponseDTO> criarUsuario(
            @RequestBody @Valid UsuarioRequestDTO requestDTO) {
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
        return usuario.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Buscar usuário por email")
    public ResponseEntity<UsuarioResponseDTO> buscarPorEmail(@PathVariable String email) {
        Optional<UsuarioResponseDTO> usuario = usuarioService.buscarPorEmail(email);
        return usuario.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar usuário parcialmente")
    public ResponseEntity<UsuarioResponseDTO> atualizarParcialmente(
            @PathVariable Long id,
            @RequestBody @Valid UsuarioUpdateDTO updateDTO) {
        try {
            Optional<UsuarioResponseDTO> usuarioAtualizado =
                    usuarioService.atualizarParcialmente(id, updateDTO);
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
        return deletado ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    public ResponseEntity<Optional<UsuarioModel>> listarPorId(@PathVariable Long id){
        Optional<UsuarioModel> optional = usuarioService.listarPorId(id);
        if (optional.isPresent()){
            return ResponseEntity.ok().body(optional);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

//    @GetMapping("/email/{email}")
//    @Operation(summary = "Buscar usuário por email")
//    public ResponseEntity<UsuarioResponseDTO> buscarPorEmail(@PathVariable String email) {
//        Optional<UsuarioResponseDTO> usuario = usuarioService.buscarPorEmail(email);
//        return usuario.map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar usuário parcialmente")
    public ResponseEntity<UsuarioResponseDTO> atualizarParcialmente(
            @PathVariable Long id,
            @RequestBody @Valid UsuarioUpdateDTO updateDTO) {
        try {
            Optional<UsuarioResponseDTO> usuarioAtualizado =
                    usuarioService.atualizarParcialmente(id, updateDTO);
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
        return deletado ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
