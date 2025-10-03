package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.exception.*;
import com.example.demo.model.*;
import com.example.demo.repository.LojaRepository;
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
public class LojaService {

    private final LojaRepository lojaRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public LojaResponseDTO criarLoja(LojaRequestDTO requestDTO) {
        // Validar CNPJ único
        if (requestDTO.getCnpj() != null && lojaRepository.existsByCnpj(requestDTO.getCnpj())) {
            throw new DuplicateResourceException("CNPJ já cadastrado: " + requestDTO.getCnpj());
        }

        LojaModel loja = modelMapper.map(requestDTO, LojaModel.class);
        loja.setStatusLoja(StatusLoja.ATIVO);

        LojaModel lojaSalva = lojaRepository.save(loja);
        log.info("Loja criada com sucesso: ID={}, Nome={}", lojaSalva.getId(), lojaSalva.getNome());

        return convertToResponseDTO(lojaSalva);
    }

    public List<LojaResponseDTO> listarTodasAtivas() {
        Sort sort = Sort.by(Sort.Order.asc("nome"));
        return lojaRepository.findLojasAtivas(sort)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<LojaResponseDTO> buscarPorId(Long id) {
        return lojaRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    @Transactional
    public Optional<LojaResponseDTO> atualizarLoja(Long id, LojaRequestDTO requestDTO) {
        Optional<LojaModel> optionalLoja = lojaRepository.findById(id);

        if (optionalLoja.isEmpty()) {
            return Optional.empty();
        }

        LojaModel lojaExistente = optionalLoja.get();

        // Validar CNPJ único
        if (requestDTO.getCnpj() != null &&
                !requestDTO.getCnpj().equals(lojaExistente.getCnpj()) &&
                lojaRepository.existsByCnpjAndIdNot(requestDTO.getCnpj(), id)) {
            throw new DuplicateResourceException("CNPJ já cadastrado: " + requestDTO.getCnpj());
        }

        lojaExistente.setNome(requestDTO.getNome());
        lojaExistente.setEndereco(requestDTO.getEndereco());
        lojaExistente.setTelefone(requestDTO.getTelefone());
        lojaExistente.setCnpj(requestDTO.getCnpj());

        LojaModel lojaAtualizada = lojaRepository.save(lojaExistente);
        return Optional.of(convertToResponseDTO(lojaAtualizada));
    }

    @Transactional
    public boolean desativarLoja(Long id) {
        Optional<LojaModel> optionalLoja = lojaRepository.findById(id);

        if (optionalLoja.isEmpty()) {
            return false;
        }

        LojaModel loja = optionalLoja.get();
        loja.setStatusLoja(StatusLoja.INATIVO);
        lojaRepository.save(loja);

        log.info("Loja desativada: ID={}, Nome={}", id, loja.getNome());
        return true;
    }

    private LojaResponseDTO convertToResponseDTO(LojaModel loja) {
        LojaResponseDTO dto = LojaResponseDTO.builder()
                .id(loja.getId())
                .nome(loja.getNome())
                .endereco(loja.getEndereco())
                .telefone(loja.getTelefone())
                .cnpj(loja.getCnpj())
                .status(loja.getStatusLoja())
                .createdAt(loja.getCreatedAt())
                .updatedAt(loja.getUpdatedAt())
                .totalProdutos(lojaRepository.countProdutosByLojaId(loja.getId()))
                .build();
        return dto;
    }
}
