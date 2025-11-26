package com.example.demo.service;

import com.example.demo.dto.PedidoRequestDTO;
import com.example.demo.dto.PedidoResponseDTO;
import com.example.demo.dto.ProdutoQuantidadeDTO;
import com.example.demo.dto.ProdutoResponseDTO; // Importe o DTO de Produto
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

    public List<PedidoResponseDTO> listarPorUsuario(String emailUsuario) {
        List<PedidoModel> pedidos = pedidoRepository.findByUsuarioEmailOrderByDataDesc(emailUsuario);

        return pedidos.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO pedidoRequestDTO) {
        var usuario = usuarioRepository.findById(pedidoRequestDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        var loja = lojaRepository.findById(pedidoRequestDTO.getLojaId())
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));

        BigDecimal valorTotal = BigDecimal.ZERO;
        List<ProdutoModel> produtos = new ArrayList<>();

        if (pedidoRequestDTO.getProdutos() != null) {
            for (ProdutoQuantidadeDTO item : pedidoRequestDTO.getProdutos()) {
                ProdutoModel produto = produtoRepository.findById(item.getId())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + item.getId()));

                BigDecimal subtotal = produto.getPreco().multiply(BigDecimal.valueOf(item.getQuantidade()));
                valorTotal = valorTotal.add(subtotal);

                produtos.add(produto);
            }
        }

        PedidoModel pedido = PedidoModel.builder()
                .pedidoStatus(PedidoStatus.CARRINHO)
                .data(LocalDateTime.now())
                .valorTotal(valorTotal.doubleValue())
                .usuario(usuario)
                .loja(loja)
                .produtos(produtos)
                .build();

        pedidoRepository.save(pedido);

        return convertToResponseDTO(pedido);
    }

    public List<PedidoResponseDTO> listarTodos(String[] sort, String[] sortDir) {
        Sort ordenacao = criarOrdenacao(sort, sortDir);
        return pedidoRepository.findAll(ordenacao).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Page<PedidoResponseDTO> listarComPaginacao(int page, int size, String[] sort, String[] sortDir) {
        Sort ordenacao = criarOrdenacao(sort, sortDir);
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
        if (requestDTO.getValorTotal() != null) pedido.setValorTotal(requestDTO.getValorTotal());
        if (requestDTO.getData() != null) pedido.setData(requestDTO.getData());
        if (requestDTO.getPedidoStatus() != null) pedido.setPedidoStatus(requestDTO.getPedidoStatus());

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

        List<ProdutoResponseDTO> itensDTO = new ArrayList<>();
        if (pedido.getProdutos() != null) {
            itensDTO = pedido.getProdutos().stream()
                    .map(prod -> modelMapper.map(prod, ProdutoResponseDTO.class))
                    .collect(Collectors.toList());
        }

        String nomeLoja = (pedido.getLoja() != null) ? pedido.getLoja().getNome() : "Loja Desconhecida";
        String nomeCliente = "Cliente Removido";
        String telefoneCliente = "";
        if (pedido.getUsuario() != null) {
            nomeCliente = pedido.getUsuario().getNome() + " " + pedido.getUsuario().getSobrenome();
            telefoneCliente = pedido.getUsuario().getTelefone();
        }

        return PedidoResponseDTO.builder()
                .id(pedido.getId())
                .valorTotal(pedido.getValorTotal())
                .pedidoStatus(pedido.getPedidoStatus())
                .data(pedido.getData())
                .nomeCliente(nomeCliente)
                .telefoneCliente(telefoneCliente)
                .nomeLoja(nomeLoja)
                .itens(itensDTO)
                .build();
    }

    private Sort criarOrdenacao(String[] sort, String[] sortDir) {
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
        return ordenacao;
    }
}