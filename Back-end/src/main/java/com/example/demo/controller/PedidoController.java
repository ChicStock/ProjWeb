package com.example.demo.controller;

import com.example.demo.dto.PedidoRequestDTO;
import com.example.demo.dto.PedidoResponseDTO;
import com.example.demo.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/pedidos")
@RequiredArgsConstructor
@Tag(name = "Pedidos", description = "Gerenciamento de pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping("/meus-pedidos")
    @Operation(summary = "Listar pedidos do usuário logado")
    public ResponseEntity<List<PedidoResponseDTO>> listarMeusPedidos(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<PedidoResponseDTO> pedidos = pedidoService.listarPorUsuario(userDetails.getUsername());
        return ResponseEntity.ok(pedidos);
    }


    @PostMapping
    @Operation(summary = "Criar novo pedido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Pedido criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro ao criar pedido")
    })
    public ResponseEntity<PedidoResponseDTO> criarPedido(@RequestBody @Valid PedidoRequestDTO requestDTO) {
        PedidoResponseDTO pedido = pedidoService.criarPedido(requestDTO);
        URI location = URI.create("/api/v1/pedidos/" + pedido.getId());
        return ResponseEntity.created(location).body(pedido);
    }

    @GetMapping
    @Operation(summary = "Listar pedidos com ordenação dinâmica (Admin)")
    public ResponseEntity<List<PedidoResponseDTO>> listarPedidos(
            @RequestParam(required = false) String[] sort,
            @RequestParam(required = false) String[] sortDir) {

        List<PedidoResponseDTO> pedidos = pedidoService.listarTodos(sort, sortDir);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/paginados")
    @Operation(summary = "Listar pedidos com paginação e ordenação")
    public ResponseEntity<Page<PedidoResponseDTO>> listarPedidosPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String[] sort,
            @RequestParam(required = false) String[] sortDir) {

        Page<PedidoResponseDTO> pedidos = pedidoService.listarComPaginacao(page, size, sort, sortDir);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar pedido por ID")
    public ResponseEntity<PedidoResponseDTO> buscarPorId(@PathVariable Long id) {
        Optional<PedidoResponseDTO> pedido = pedidoService.buscarPorId(id);
        return pedido.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar pedido completo")
    public ResponseEntity<PedidoResponseDTO> atualizarPedido(
            @PathVariable Long id,
            @RequestBody @Valid PedidoRequestDTO requestDTO) {

        Optional<PedidoResponseDTO> atualizado = pedidoService.atualizarPedido(id, requestDTO);
        return atualizado.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir pedido")
    public ResponseEntity<Void> excluirPedido(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean confirm) {

        pedidoService.excluirPedido(id, confirm);
        return ResponseEntity.noContent().build();
    }
}