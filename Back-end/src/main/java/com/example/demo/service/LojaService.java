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

        if (requestDTO.getCnpj() != null && !requestDTO.getCnpj().isEmpty() && lojaRepository.existsByCnpj(requestDTO.getCnpj())) {
            throw new IllegalArgumentException("CNPJ já cadastrado.");
        }

        LojaModel loja = new LojaModel();
        loja.setNome(requestDTO.getNome());
        loja.setDescricao(requestDTO.getDescricao());
        loja.setEndereco(requestDTO.getEndereco());
        loja.setTelefone(requestDTO.getTelefone());
        loja.setCnpj(requestDTO.getCnpj());
        loja.setEntrega(requestDTO.getEntrega());
        loja.setPagamento(requestDTO.getPagamento());

        loja.setStatusLoja(StatusLoja.ATIVO);
        loja.setUsuario(usuario);

        usuario.setRole(UserRole.LOJISTA);
        usuario.setLoja(loja);

        lojaRepository.save(loja);
        usuarioRepository.save(usuario);

        return converterParaDTO(loja);
    }

    public List<LojaResponseDTO> listarTodasAtivas() {
        return lojaRepository.findLojasAtivas(Sort.by("nome")).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public Optional<LojaResponseDTO> buscarPorId(Long id) {
        return lojaRepository.findById(id)
                .map(this::converterParaDTO);
    }

    @Transactional
    public Optional<LojaResponseDTO> atualizarLoja(Long id, LojaRequestDTO requestDTO) {
        return lojaRepository.findById(id).map(loja -> {

            if (requestDTO.getNome() != null) loja.setNome(requestDTO.getNome());
            if (requestDTO.getDescricao() != null) loja.setDescricao(requestDTO.getDescricao());
            if (requestDTO.getEndereco() != null) loja.setEndereco(requestDTO.getEndereco());
            if (requestDTO.getTelefone() != null) loja.setTelefone(requestDTO.getTelefone());
            if (requestDTO.getCnpj() != null) loja.setCnpj(requestDTO.getCnpj());
            if (requestDTO.getEntrega() != null) loja.setEntrega(requestDTO.getEntrega());
            if (requestDTO.getPagamento() != null) loja.setPagamento(requestDTO.getPagamento());

            lojaRepository.save(loja);
            return converterParaDTO(loja);
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

    private LojaResponseDTO converterParaDTO(LojaModel loja) {
        return LojaResponseDTO.builder()
                .id(loja.getId())
                .nome(loja.getNome())
                .descricao(loja.getDescricao())
                .endereco(loja.getEndereco())
                .telefone(loja.getTelefone())
                .cnpj(loja.getCnpj())
                .entrega(loja.getEntrega())
                .pagamento(loja.getPagamento())
                .status(loja.getStatusLoja())
                .createdAt(loja.getCreatedAt())
                .updatedAt(loja.getUpdatedAt())
                .totalProdutos(lojaRepository.countProdutosByLojaId(loja.getId()))
                .build();
    }
}