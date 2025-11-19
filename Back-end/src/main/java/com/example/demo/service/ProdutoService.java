package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.exception.*;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.modelmapper.ModelMapper;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final LojaRepository lojaRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public ProdutoResponseDTO criarProduto(ProdutoRequestDTO requestDTO) {

        CategoriaModel categoria = categoriaRepository.findById(requestDTO.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com ID: " + requestDTO.getCategoriaId()));

        if (categoria.getStatus() != CategoriaStatus.ATIVO) {
            throw new InvalidOperationException("Categoria não está ativa: " + categoria.getNome());
        }

        LojaModel loja = lojaRepository.findById(requestDTO.getLojaId())
                .orElseThrow(() -> new ResourceNotFoundException("Loja não encontrada com ID: " + requestDTO.getLojaId()));

        if (loja.getStatusLoja() != StatusLoja.ATIVO) {
            throw new InvalidOperationException("Loja não está ativa: " + loja.getNome());
        }

        ProdutoModel produto = ProdutoModel.builder()
                .nome(requestDTO.getNome())
                .preco(requestDTO.getPreco())
                .descricao(requestDTO.getDescricao())
                .quantidade(requestDTO.getQuantidade())
                .imgUrl(requestDTO.getImgUrl())
                .categoria(categoria)
                .loja(loja)
                .status(ProdutoStatus.ATIVO)
                .build();

        ProdutoModel produtoSalvo = produtoRepository.save(produto);
        log.info("Produto criado com sucesso: ID={}, Nome={}", produtoSalvo.getId(), produtoSalvo.getNome());

        return convertToResponseDTO(produtoSalvo);
    }

    public List<ProdutoResponseDTO> listarTodosAtivos() {
        Sort sort = Sort.by(Sort.Order.asc("nome"));
        return produtoRepository.findByStatus(ProdutoStatus.ATIVO, sort)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ProdutoResponseDTO> listarComOrdenacao(String[] sortBy, String[] sortDir) {
        Sort sort = buildDynamicSort(sortBy, sortDir);
        return produtoRepository.findByStatus(ProdutoStatus.ATIVO, sort)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ProdutoResponseDTO> listarPorPrecoENome(boolean precoDesc) {
        List<ProdutoModel> produtos = precoDesc ?
                produtoRepository.findAllByStatusOrderByPrecoDescNomeAsc(ProdutoStatus.ATIVO) :
                produtoRepository.findAllByStatusOrderByPrecoAscNomeAsc(ProdutoStatus.ATIVO);

        return produtos.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Page<ProdutoResponseDTO> listarComPaginacao(int page, int size, String[] sortBy, String[] sortDir) {
        Sort sort = buildDynamicSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProdutoModel> produtoPage = produtoRepository.findByStatus(ProdutoStatus.ATIVO, pageable);
        return produtoPage.map(this::convertToResponseDTO);
    }

    public Page<ProdutoResponseDTO> buscarComFiltros(String nome, Long categoriaId, Long lojaId,
                                                     BigDecimal precoMin, BigDecimal precoMax,
                                                     int page, int size, String[] sortBy, String[] sortDir) {
        Sort sort = buildDynamicSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProdutoModel> produtoPage = produtoRepository.findProdutosComFiltros(
                nome, categoriaId, lojaId, precoMin, precoMax, pageable);

        return produtoPage.map(this::convertToResponseDTO);
    }

    public Optional<ProdutoResponseDTO> buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .filter(p -> p.getStatus() == ProdutoStatus.ATIVO)
                .map(this::convertToResponseDTO);
    }

    public List<ProdutoResponseDTO> buscarPorCategoria(Long categoriaId) {
        Sort sort = Sort.by(Sort.Order.asc("nome"));
        return produtoRepository.findByCategoriaIdAndStatus(categoriaId, ProdutoStatus.ATIVO, sort)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ProdutoResponseDTO> buscarPorLoja(Long lojaId) {
        Sort sort = Sort.by(Sort.Order.asc("nome"));
        return produtoRepository.findByLojaIdAndStatus(lojaId, ProdutoStatus.ATIVO, sort)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<ProdutoResponseDTO> atualizarProduto(Long id, ProdutoUpdateDTO updateDTO) {
        Optional<ProdutoModel> optionalProduto = produtoRepository.findById(id);

        if (optionalProduto.isEmpty()) {
            return Optional.empty();
        }

        ProdutoModel produtoExistente = optionalProduto.get();

        if (updateDTO.getCategoriaId() != null) {
            CategoriaModel categoria = categoriaRepository.findById(updateDTO.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

            if (categoria.getStatus() != CategoriaStatus.ATIVO) {
                throw new InvalidOperationException("Categoria não está ativa");
            }
            produtoExistente.setCategoria(categoria);
        }

        if (updateDTO.getLojaId() != null) {
            LojaModel loja = lojaRepository.findById(updateDTO.getLojaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Loja não encontrada"));

            if (loja.getStatusLoja() != StatusLoja.ATIVO) {
                throw new InvalidOperationException("Loja não está ativa");
            }
            produtoExistente.setLoja(loja);
        }

        if (updateDTO.getNome() != null) {
            produtoExistente.setNome(updateDTO.getNome());
        }
        if (updateDTO.getPreco() != null) {
            produtoExistente.setPreco(updateDTO.getPreco());
        }
        if (updateDTO.getDescricao() != null) {
            produtoExistente.setDescricao(updateDTO.getDescricao());
        }
        if (updateDTO.getQuantidade() != null) {
            produtoExistente.setQuantidade(updateDTO.getQuantidade());
        }
        if (updateDTO.getImgUrl() != null) {
            produtoExistente.setImgUrl(updateDTO.getImgUrl());
        }

        ProdutoModel produtoAtualizado = produtoRepository.save(produtoExistente);
        return Optional.of(convertToResponseDTO(produtoAtualizado));
    }

    @Transactional
    public void excluirProduto(Long id, boolean confirm) {

        if (!confirm) {
            throw new ConfirmationRequiredException(
                    "Para excluir este produto, você deve confirmar a operação enviando 'confirm=true'"
            );
        }

        ProdutoModel produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + id));

        log.info("Excluindo produto: ID={}, Nome={}, Categoria={}, Loja={}",
                id, produto.getNome(), produto.getCategoria().getNome(), produto.getLoja().getNome());

        produtoRepository.delete(produto);

        log.info("Produto excluído com sucesso: ID={}", id);
    }

    private Sort buildDynamicSort(String[] sortBy, String[] sortDir) {
        if (sortBy == null || sortBy.length == 0) {

            return Sort.by(
                    Sort.Order.asc("preco"),
                    Sort.Order.asc("nome")
            );
        }

        List<Sort.Order> orders = new ArrayList<>();

        for (int i = 0; i < sortBy.length; i++) {
            String field = sortBy[i];
            String direction = (sortDir != null && i < sortDir.length) ?
                    sortDir[i] : "asc";

            Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ?
                    Sort.Direction.DESC : Sort.Direction.ASC;

            orders.add(new Sort.Order(sortDirection, field));
        }

        return Sort.by(orders);
    }

    private ProdutoResponseDTO convertToResponseDTO(ProdutoModel produto) {
        return ProdutoResponseDTO.builder()
                .id(produto.getId())
                .nome(produto.getNome())
                .preco(produto.getPreco())
                .descricao(produto.getDescricao())
                .quantidade(produto.getQuantidade())
                .imgUrl(produto.getImgUrl())
                .status(produto.getStatus())
                .categoriaId(produto.getCategoria().getId())
                .nomeCategoria(produto.getCategoria().getNome())
                .lojaId(produto.getLoja().getId())
                .nomeLoja(produto.getLoja().getNome())
                .createdAt(produto.getCriadoEm())
                .updatedAt(produto.getAtualizadoEm())
                .build();
    }
}
