package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.model.*;
import com.example.demo.repository.CategoriaRepository;
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
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public CategoriaResponseDTO criarCategoria(CategoriaRequestDTO requestDTO) {
        CategoriaModel categoria = modelMapper.map(requestDTO, CategoriaModel.class);
        categoria.setStatus(CategoriaStatus.ATIVO);

        CategoriaModel categoriaSalva = categoriaRepository.save(categoria);
        log.info("Categoria criada com sucesso: ID={}, Nome={}", categoriaSalva.getId(), categoriaSalva.getNome());

        return convertToResponseDTO(categoriaSalva);
    }

    public List<CategoriaResponseDTO> listarTodasAtivas() {
        Sort sort = Sort.by(Sort.Order.asc("nome"));
        return categoriaRepository.findCategoriasAtivas(sort)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<CategoriaResponseDTO> buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    @Transactional
    public Optional<CategoriaResponseDTO> atualizarCategoria(Long id, CategoriaRequestDTO requestDTO) {
        Optional<CategoriaModel> optionalCategoria = categoriaRepository.findById(id);

        if (optionalCategoria.isEmpty()) {
            return Optional.empty();
        }

        CategoriaModel categoriaExistente = optionalCategoria.get();
        categoriaExistente.setNome(requestDTO.getNome());
        categoriaExistente.setDescricao(requestDTO.getDescricao());

        CategoriaModel categoriaAtualizada = categoriaRepository.save(categoriaExistente);
        return Optional.of(convertToResponseDTO(categoriaAtualizada));
    }

    @Transactional
    public boolean desativarCategoria(Long id) {
        Optional<CategoriaModel> optionalCategoria = categoriaRepository.findById(id);

        if (optionalCategoria.isEmpty()) {
            return false;
        }

        CategoriaModel categoria = optionalCategoria.get();
        categoria.setStatus(CategoriaStatus.INATIVO);
        categoriaRepository.save(categoria);

        log.info("Categoria desativada: ID={}, Nome={}", id, categoria.getNome());
        return true;
    }

    private CategoriaResponseDTO convertToResponseDTO(CategoriaModel categoria) {
        CategoriaResponseDTO dto = modelMapper.map(categoria, CategoriaResponseDTO.class);
        dto.setTotalProdutos(categoriaRepository.countProdutosByCategoriaId(categoria.getId()));
        return dto;
    }
}
