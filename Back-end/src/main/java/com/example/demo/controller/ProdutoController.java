package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.ProdutoService;
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
@RequestMapping("/api/v1/produtos")
@RequiredArgsConstructor
@Tag(name = "Produtos", description = "Gerenciamento de produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    @PostMapping
    @Operation(summary = "Criar novo produto")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Produto criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Categoria ou loja não encontrada")
    })
    public ResponseEntity<ProdutoResponseDTO> criarProduto(@RequestBody @Valid ProdutoRequestDTO requestDTO) {
        try {
            ProdutoResponseDTO produto = produtoService.criarProduto(requestDTO);
            URI location = URI.create("/api/v1/produtos/" + produto.getId());
            return ResponseEntity.created(location).body(produto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    @Operation(summary = "Listar todos os produtos ativos com ordenação dinâmica")
    public ResponseEntity<List<ProdutoResponseDTO>> listarProdutos(
            @RequestParam(required = false) String[] sort,
            @RequestParam(required = false) String[] sortDir) {

        List<ProdutoResponseDTO> produtos = produtoService.listarComOrdenacao(sort, sortDir);
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/ordenados-por-preco")
    @Operation(summary = "Listar produtos ordenados por preço e nome")
    public ResponseEntity<List<ProdutoResponseDTO>> listarProdutosPorPrecoENome(
            @RequestParam(defaultValue = "false") boolean precoDesc) {

        List<ProdutoResponseDTO> produtos = produtoService.listarPorPrecoENome(precoDesc);
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/paginados")
    @Operation(summary = "Listar produtos com paginação e ordenação")
    public ResponseEntity<Page<ProdutoResponseDTO>> listarProdutosPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String[] sort,
            @RequestParam(required = false) String[] sortDir) {

        Page<ProdutoResponseDTO> produtos = produtoService.listarComPaginacao(page, size, sort, sortDir);
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar produtos com filtros avançados")
    public ResponseEntity<Page<ProdutoResponseDTO>> buscarProdutos(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long lojaId,
            @RequestParam(required = false) BigDecimal precoMin,
            @RequestParam(required = false) BigDecimal precoMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String[] sort,
            @RequestParam(required = false) String[] sortDir) {

        Page<ProdutoResponseDTO> produtos = produtoService.buscarComFiltros(
                nome, categoriaId, lojaId, precoMin, precoMax, page, size, sort, sortDir);
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar produto por ID")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Long id) {
        Optional<ProdutoResponseDTO> produto = produtoService.buscarPorId(id);
        return produto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoriaId}")
    @Operation(summary = "Buscar produtos por categoria")
    public ResponseEntity<List<ProdutoResponseDTO>> buscarPorCategoria(@PathVariable Long categoriaId) {
        List<ProdutoResponseDTO> produtos = produtoService.buscarPorCategoria(categoriaId);
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/loja/{lojaId}")
    @Operation(summary = "Buscar produtos por loja")
    public ResponseEntity<List<ProdutoResponseDTO>> buscarPorLoja(@PathVariable Long lojaId) {
        List<ProdutoResponseDTO> produtos = produtoService.buscarPorLoja(lojaId);
        return ResponseEntity.ok(produtos);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar produto completo")
    public ResponseEntity<ProdutoResponseDTO> atualizarProduto(
            @PathVariable Long id,
            @RequestBody @Valid ProdutoRequestDTO requestDTO) {

        ProdutoUpdateDTO updateDTO = new ProdutoUpdateDTO();
        updateDTO.setNome(requestDTO.getNome());
        updateDTO.setPreco(requestDTO.getPreco());
        updateDTO.setDescricao(requestDTO.getDescricao());
        updateDTO.setQuantidade(requestDTO.getQuantidade());
        updateDTO.setImgUrl(requestDTO.getImgUrl());
        updateDTO.setCategoriaId(requestDTO.getCategoriaId());
        updateDTO.setLojaId(requestDTO.getLojaId());

        try {
            Optional<ProdutoResponseDTO> atualizado = produtoService.atualizarProduto(id, updateDTO);
            return atualizado.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar produto parcialmente")
    public ResponseEntity<ProdutoResponseDTO> atualizarProdutoParcial(
            @PathVariable Long id,
            @RequestBody @Valid ProdutoUpdateDTO updateDTO) {
        try {
            Optional<ProdutoResponseDTO> atualizado = produtoService.atualizarProduto(id, updateDTO);
            return atualizado.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Excluir produto",
            description = "Exclui um produto existente. Requer confirmação explícita."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Produto excluído com sucesso"),
            @ApiResponse(responseCode = "400", description = "Confirmação não fornecida"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    public ResponseEntity<Void> excluirProduto(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean confirm) {

        produtoService.excluirProduto(id, confirm);
        return ResponseEntity.noContent().build();
    }
}
