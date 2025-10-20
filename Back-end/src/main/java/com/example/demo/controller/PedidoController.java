package com.example.demo.controller;

import com.example.demo.dto.PedidoRequestDTO;
import com.example.demo.dto.PedidoResponseDTO;
import com.example.demo.dto.PedidoUpdateDTO;
import com.example.demo.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/pedidos")
@RequiredArgsConstructor
@Tag(name = "Pedidos", description = "Gerenciamento de pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    @Operation(summary = "Criar novo pedido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Pedido criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Categoria ou loja não encontrada")
    })
    public ResponseEntity<PedidoResponseDTO> criarPedido(@RequestBody @Valid PedidoRequestDTO requestDTO) {
        try {
            PedidoResponseDTO pedido = pedidoService.criarPedido(requestDTO);
            URI location = URI.create("/api/v1/pedidos/" + pedido.getId());
            return ResponseEntity.created(location).body(pedido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    @Operation(summary = "Listar todos os pedidos ativos com ordenação dinâmica")
    public ResponseEntity<List<PedidoResponseDTO>> listarPedidos(
            @RequestParam(required = false) String[] sort,
            @RequestParam(required = false) String[] sortDir) {

        List<PedidoResponseDTO> pedidos = pedidoService.listarComOrdenacao(sort, sortDir);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/ordenados-por-preco")
    @Operation(summary = "Listar pedidos ordenados por preço e nome")
    public ResponseEntity<List<PedidoResponseDTO>> listarPedidosPorPrecoENome(
            @RequestParam(defaultValue = "false") boolean precoDesc) {

        List<PedidoResponseDTO> pedidos = pedidoService.listarPorPrecoENome(precoDesc);
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

    @GetMapping("/buscar")
    @Operation(summary = "Buscar pedidos com filtros avançados")
    public ResponseEntity<Page<PedidoResponseDTO>> buscarPedidos(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long lojaId,
            @RequestParam(required = false) BigDecimal precoMin,
            @RequestParam(required = false) BigDecimal precoMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String[] sort,
            @RequestParam(required = false) String[] sortDir) {

        Page<PedidoResponseDTO> pedidos = pedidoService.buscarComFiltros(
                nome, categoriaId, lojaId, precoMin, precoMax, page, size, sort, sortDir);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar pedido por ID")
    public ResponseEntity<PedidoResponseDTO> buscarPorId(@PathVariable Long id) {
        Optional<PedidoResponseDTO> pedido = pedidoService.buscarPorId(id);
        return pedido.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoriaId}")
    @Operation(summary = "Buscar pedidos por categoria")
    public ResponseEntity<List<PedidoResponseDTO>> buscarPorCategoria(@PathVariable Long categoriaId) {
        List<PedidoResponseDTO> pedidos = pedidoService.buscarPorCategoria(categoriaId);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/loja/{lojaId}")
    @Operation(summary = "Buscar pedidos por loja")
    public ResponseEntity<List<PedidoResponseDTO>> buscarPorLoja(@PathVariable Long lojaId) {
        List<PedidoResponseDTO> pedidos = pedidoService.buscarPorLoja(lojaId);
        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar pedido completo")
    public ResponseEntity<PedidoResponseDTO> atualizarPedido(
            @PathVariable Long id,
            @RequestBody @Valid PedidoRequestDTO requestDTO) {

        PedidoUpdateDTO updateDTO = new PedidoUpdateDTO();
        updateDTO.setNome(requestDTO.getNome());
        updateDTO.setPreco(requestDTO.getPreco());
        updateDTO.setDescricao(requestDTO.getDescricao());
        updateDTO.setQuantidade(requestDTO.getQuantidade());
        updateDTO.setImgUrl(requestDTO.getImgUrl());
        updateDTO.setCategoriaId(requestDTO.getCategoriaId());
        updateDTO.setLojaId(requestDTO.getLojaId());

        try {
            Optional<PedidoResponseDTO> atualizado = pedidoService.atualizarPedido(id, updateDTO);
            return atualizado.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar pedido parcialmente")
    public ResponseEntity<PedidoResponseDTO> atualizarPedidoParcial(
            @PathVariable Long id,
            @RequestBody @Valid PedidoUpdateDTO updateDTO) {
        try {
            Optional<PedidoResponseDTO> atualizado = pedidoService.atualizarPedido(id, updateDTO);
            return atualizado.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Excluir pedido",
            description = "Exclui um pedido existente. Requer confirmação explícita."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Pedido excluído com sucesso"),
            @ApiResponse(responseCode = "400", description = "Confirmação não fornecida"),
            @ApiResponse(responseCode = "404", description = "Pedido não encontrado")
    })
    public ResponseEntity<Void> excluirPedido(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean confirm) {

        pedidoService.excluirPedido(id, confirm);
        return ResponseEntity.noContent().build();
    }
}
