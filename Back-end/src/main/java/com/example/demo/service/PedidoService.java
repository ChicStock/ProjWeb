package com.example.demo.service;

import com.example.demo.dto.PedidoRequestDTO;
import com.example.demo.dto.PedidoResponseDTO;
import com.example.demo.dto.ProdutoQuantidadeDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.repository.LojaRepository;
import com.example.demo.repository.PedidoRepository;
import com.example.demo.repository.ProdutoRepository;
import com.example.demo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PedidoService {

    private final ProdutoRepository produtoRepository;
    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LojaRepository lojaRepository;
    private final ModelMapper modelMapper;

    public PedidoResponseDTO criarPedido(PedidoRequestDTO pedidoRequestDTO) {
        var usuario = usuarioRepository.findById(pedidoRequestDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        var loja = lojaRepository.findById(pedidoRequestDTO.getLojaId())
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));

        BigDecimal valorTotal = BigDecimal.ZERO;
        List<ProdutoModel> produtos = new ArrayList<>();

        for (ProdutoQuantidadeDTO item : pedidoRequestDTO.getProdutos()) {
            ProdutoModel produto = produtoRepository.findById(item.getId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + item.getId()));

            BigDecimal subtotal = produto.getPreco().multiply(BigDecimal.valueOf(item.getQuantidade()));
            valorTotal = valorTotal.add(subtotal);

            produtos.add(produto);
        }

        PedidoModel pedido = PedidoModel.builder()
                .pedidoStatus(PedidoStatus.CARRINHO)
                .data(LocalDateTime.now())
                .valorTotal(valorTotal.doubleValue()) // ou altere o tipo de valorTotal para BigDecimal
                .usuario(usuario)
                .loja(loja)
                .produtos(produtos)
                .build();

        pedidoRepository.save(pedido);

        return new PedidoResponseDTO(
                pedido.getId(),
                pedido.getValorTotal(),
                pedido.getPedidoStatus(),
                pedido.getData()
        );
    }


    public List<PedidoResponseDTO> listarTodos(String[] sort, String[] sortDir) {
        Sort ordenacao = Sort.unsorted();

        if (sort != null && sortDir != null && sort.length == sortDir.length) {
            for (int i = 0; i < sort.length; i++) {
                ordenacao = ordenacao.and(
                        Sort.by(sortDir[i].equalsIgnoreCase("desc") ?
                                        Sort.Direction.DESC : Sort.Direction.ASC,
                                sort[i])
                );
            }
        }

        return pedidoRepository.findAll(ordenacao).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Page<PedidoResponseDTO> listarComPaginacao(int page, int size, String[] sort, String[] sortDir) {
        Sort ordenacao = Sort.unsorted();

        if (sort != null && sortDir != null && sort.length == sortDir.length) {
            for (int i = 0; i < sort.length; i++) {
                ordenacao = ordenacao.and(
                        Sort.by(sortDir[i].equalsIgnoreCase("desc") ?
                                        Sort.Direction.DESC : Sort.Direction.ASC,
                                sort[i])
                );
            }
        }

        Pageable pageable = PageRequest.of(page, size, ordenacao);

        return pedidoRepository.findAll(pageable)
                .map(this::convertToResponseDTO);
    }

    public Optional<PedidoResponseDTO> buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    @Transactional
    public Optional<PedidoResponseDTO> atualizarPedido(Long id, PedidoRequestDTO requestDTO) {
        Optional<PedidoModel> optional = pedidoRepository.findById(id);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Pedido não encontrado com ID " + id);
        }

        PedidoModel pedido = optional.get();
        pedido.setValorTotal(requestDTO.getValorTotal());
        pedido.setData(requestDTO.getData());
        pedido.setPedidoStatus(requestDTO.getPedidoStatus());

        PedidoModel atualizado = pedidoRepository.save(pedido);
        return Optional.of(convertToResponseDTO(atualizado));
    }

    @Transactional
    public void excluirPedido(Long id, boolean confirm) {
        if (!confirm) {
            throw new IllegalArgumentException("É necessário confirmar a exclusão com ?confirm=true");
        }

        if (!pedidoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pedido não encontrado com ID " + id);
        }

        pedidoRepository.deleteById(id);
        log.info("🗑️ Pedido excluído com sucesso (ID: {})", id);
    }

    private PedidoResponseDTO convertToResponseDTO(PedidoModel pedido) {
        return modelMapper.map(pedido, PedidoResponseDTO.class);
    }
}
