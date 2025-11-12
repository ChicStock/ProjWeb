package com.example.demo.service;

import com.example.demo.dto.LojaRequestDTO;
import com.example.demo.dto.LojaResponseDTO;
import com.example.demo.model.LojaModel;
import com.example.demo.model.StatusLoja;
import com.example.demo.model.UsuarioModel;
import com.example.demo.model.enums.UserRole;
import com.example.demo.repository.LojaRepository;
import com.example.demo.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LojaService {

    private final LojaRepository lojaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public LojaResponseDTO criarLoja(LojaRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        UsuarioModel usuario = usuarioRepository.findByEmail(email);

        if (usuario == null) {
            throw new EntityNotFoundException("Usuário não encontrado.");
        }

        if (usuario.getLoja() != null) {
            throw new IllegalStateException("Usuário já possui uma loja vinculada.");
        }

        if (lojaRepository.existsByCnpj(requestDTO.getCnpj())) {
            throw new IllegalArgumentException("CNPJ já cadastrado.");
        }

        LojaModel loja = new LojaModel();
        loja.setNome(requestDTO.getNome());
        loja.setEndereco(requestDTO.getEndereco());
        loja.setTelefone(requestDTO.getTelefone());
        loja.setCnpj(requestDTO.getCnpj());
        loja.setStatusLoja(StatusLoja.ATIVO);
        loja.setUsuario(usuario);

        usuario.setRole(UserRole.LOJISTA);
        usuario.setLoja(loja);

        lojaRepository.save(loja);
        usuarioRepository.save(usuario);

        return LojaResponseDTO.builder()
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
    }

    public List<LojaResponseDTO> listarTodasAtivas() {
        return lojaRepository.findLojasAtivas(Sort.by("nome")).stream()
                .map(loja -> LojaResponseDTO.builder()
                        .id(loja.getId())
                        .nome(loja.getNome())
                        .endereco(loja.getEndereco())
                        .telefone(loja.getTelefone())
                        .cnpj(loja.getCnpj())
                        .status(loja.getStatusLoja())
                        .createdAt(loja.getCreatedAt())
                        .updatedAt(loja.getUpdatedAt())
                        .totalProdutos(lojaRepository.countProdutosByLojaId(loja.getId()))
                        .build())
                .collect(Collectors.toList());
    }

    public Optional<LojaResponseDTO> buscarPorId(Long id) {
        return lojaRepository.findById(id)
                .map(loja -> LojaResponseDTO.builder()
                        .id(loja.getId())
                        .nome(loja.getNome())
                        .endereco(loja.getEndereco())
                        .telefone(loja.getTelefone())
                        .cnpj(loja.getCnpj())
                        .status(loja.getStatusLoja())
                        .createdAt(loja.getCreatedAt())
                        .updatedAt(loja.getUpdatedAt())
                        .totalProdutos(lojaRepository.countProdutosByLojaId(loja.getId()))
                        .build());
    }

    @Transactional
    public Optional<LojaResponseDTO> atualizarLoja(Long id, LojaRequestDTO requestDTO) {
        return lojaRepository.findById(id).map(loja -> {
            loja.setNome(requestDTO.getNome());
            loja.setEndereco(requestDTO.getEndereco());
            loja.setTelefone(requestDTO.getTelefone());
            loja.setCnpj(requestDTO.getCnpj());
            lojaRepository.save(loja);

            return LojaResponseDTO.builder()
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
        });
    }

    @Transactional
    public boolean desativarLoja(Long id) {
        Optional<LojaModel> lojaOpt = lojaRepository.findById(id);
        if (lojaOpt.isPresent()) {
            LojaModel loja = lojaOpt.get();
            loja.setStatusLoja(StatusLoja.INATIVO);
            lojaRepository.save(loja);
            return true;
        }
        return false;
    }
}
