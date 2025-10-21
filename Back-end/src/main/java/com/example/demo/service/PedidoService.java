package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.exception.*;
import com.example.demo.model.*;
import com.example.demo.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO requestDTO) {

        PedidoModel pedido = modelMapper.map(requestDTO, PedidoModel.class);
        pedido.setPedidoStatus(PedidoStatus.PAGAMENTO_PENDENTE);

        PedidoModel pedidoSalvo = pedidoRepository.save(pedido);
        log.info("Pedido criada com sucesso: ID={}", pedidoSalvo.getId());

        return convertToResponseDTO(pedidoSalvo);
    }

    public List<PedidoResponseDTO> listarTodasAtivas() {
        Sort sort = Sort.by(Sort.Order.asc("id"));
        return pedidoRepository.findAll(sort)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<PedidoResponseDTO> buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    @Transactional
    public Optional<PedidoResponseDTO> atualizarPedido(Long id, PedidoRequestDTO requestDTO) {
        Optional<PedidoModel> optionalPedido = pedidoRepository.findById(id);

        if (optionalPedido.isEmpty()) {
            return Optional.empty();
        }

        PedidoModel pedidoExistente = optionalPedido.get();

        pedidoExistente.setValorTotal(requestDTO.getValorTotal());
        pedidoExistente.setData(requestDTO.getData());

        PedidoModel pedidoAtualizada = pedidoRepository.save(pedidoExistente);
        return Optional.of(convertToResponseDTO(pedidoAtualizada));
    }

    private PedidoResponseDTO convertToResponseDTO(PedidoModel pedido) {
        PedidoResponseDTO dto = PedidoResponseDTO.builder()
                .id(pedido.getId())
                .valorTotal(pedido.getValorTotal())
                .data(pedido.getData())
                .build();
        return dto;
    }
}
