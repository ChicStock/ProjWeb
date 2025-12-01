package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/produtos")
@RequiredArgsConstructor
@Tag(name = "Produtos", description = "Gerenciamento de produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Criar novo produto com foto")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Produto criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    public ResponseEntity<ProdutoResponseDTO> criarProduto(
            @RequestParam("nome") String nome,
            @RequestParam("descricao") String descricao,
            @RequestParam("preco") Double preco,
            @RequestParam("quantidade") Integer quantidade,
            @RequestParam("categoriaId") Long categoriaId,
            @RequestParam("lojaId") Long lojaId,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem
    ) {
        try {
            String imgUrl = salvarImagem(imagem);

            ProdutoRequestDTO requestDTO = new ProdutoRequestDTO();
            requestDTO.setNome(nome);
            requestDTO.setDescricao(descricao);
            requestDTO.setPreco(BigDecimal.valueOf(preco));
            requestDTO.setQuantidade(quantidade);
            requestDTO.setCategoriaId(categoriaId);
            requestDTO.setLojaId(lojaId);
            requestDTO.setImgUrl(imgUrl);

            ProdutoResponseDTO produto = produtoService.criarProduto(requestDTO);
            URI location = URI.create("/api/v1/produtos/" + produto.getId());
            return ResponseEntity.created(location).body(produto);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Atualizar produto completo")
    public ResponseEntity<ProdutoResponseDTO> atualizarProduto(
            @PathVariable Long id,
            @RequestParam(value = "nome", required = false) String nome,
            @RequestParam(value = "descricao", required = false) String descricao,
            @RequestParam(value = "preco", required = false) Double preco,
            @RequestParam(value = "quantidade", required = false) Integer quantidade,
            @RequestParam(value = "categoriaId", required = false) Long categoriaId,
            @RequestParam(value = "lojaId", required = false) Long lojaId,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem
    ) {
        try {
            String imgUrl = salvarImagem(imagem);

            ProdutoUpdateDTO updateDTO = new ProdutoUpdateDTO();
            updateDTO.setNome(nome);
            if (preco != null) updateDTO.setPreco(BigDecimal.valueOf(preco));
            updateDTO.setDescricao(descricao);
            updateDTO.setQuantidade(quantidade);
            updateDTO.setCategoriaId(categoriaId);
            updateDTO.setLojaId(lojaId);

            if (imgUrl != null) {
                updateDTO.setImgUrl(imgUrl);
            }

            Optional<ProdutoResponseDTO> atualizado = produtoService.atualizarProduto(id, updateDTO);
            return atualizado.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String salvarImagem(MultipartFile imagem) throws IOException {
        if (imagem != null && !imagem.isEmpty()) {
            Path diretorio = Paths.get("uploads");
            if (!Files.exists(diretorio)) {
                Files.createDirectories(diretorio);
            }
            String nomeArquivo = UUID.randomUUID() + "_" + imagem.getOriginalFilename();
            Path caminhoArquivo = diretorio.resolve(nomeArquivo);
            Files.copy(imagem.getInputStream(), caminhoArquivo, StandardCopyOption.REPLACE_EXISTING);
            return "/imagens/" + nomeArquivo;
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listarProdutos(
            @RequestParam(required = false) String[] sort,
            @RequestParam(required = false) String[] sortDir) {
        return ResponseEntity.ok(produtoService.listarComOrdenacao(sort, sortDir));
    }

    @GetMapping("/paginados")
    public ResponseEntity<Page<ProdutoResponseDTO>> listarProdutosPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String[] sort,
            @RequestParam(required = false) String[] sortDir) {
        return ResponseEntity.ok(produtoService.listarComPaginacao(page, size, sort, sortDir));
    }

    @GetMapping("/buscar")
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
        return ResponseEntity.ok(produtoService.buscarComFiltros(nome, categoriaId, lojaId, precoMin, precoMax, page, size, sort, sortDir));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Long id) {
        return produtoService.buscarPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProdutoResponseDTO>> buscarPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(produtoService.buscarPorCategoria(categoriaId));
    }

    @GetMapping("/loja/{lojaId}")
    public ResponseEntity<List<ProdutoResponseDTO>> buscarPorLoja(@PathVariable Long lojaId) {
        return ResponseEntity.ok(produtoService.buscarPorLoja(lojaId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirProduto(@PathVariable Long id, @RequestParam(defaultValue = "false") boolean confirm) {
        produtoService.excluirProduto(id, confirm);
        return ResponseEntity.noContent().build();
    }
}