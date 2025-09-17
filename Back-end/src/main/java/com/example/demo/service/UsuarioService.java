package com.example.demo.service; // Corrigido o package

import com.example.demo.dto.UsuarioRequestDTO;
import com.example.demo.dto.UsuarioResponseDTO;
import com.example.demo.dto.UsuarioUpdateDTO;
import com.example.demo.exception.DuplicateResourceException; // Corrigido o import
import com.example.demo.model.UsuarioModel;
import com.example.demo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Transactional
    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO requestDTO) {
        // Validar duplicatas
        validarEmailUnico(requestDTO.getEmail());
        if (requestDTO.getCpf() != null) {
            validarCpfUnico(requestDTO.getCpf());
        }
        if (requestDTO.getTelefone() != null) {
            validarTelefoneUnico(requestDTO.getTelefone());
        }

        UsuarioModel usuario = modelMapper.map(requestDTO, UsuarioModel.class);

        usuario.setSenha(passwordEncoder.encode(requestDTO.getSenha()));

        UsuarioModel usuarioSalvo = usuarioRepository.save(usuario);
        return modelMapper.map(usuarioSalvo, UsuarioResponseDTO.class);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuario -> modelMapper.map(usuario, UsuarioResponseDTO.class))
                .collect(Collectors.toList());
    }

    public Optional<UsuarioResponseDTO> buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> modelMapper.map(usuario, UsuarioResponseDTO.class));
    }

    public Optional<UsuarioResponseDTO> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .map(usuario -> modelMapper.map(usuario, UsuarioResponseDTO.class));
    }

    @Transactional
    public Optional<UsuarioResponseDTO> atualizarParcialmente(Long id, UsuarioUpdateDTO updateDTO) {
        Optional<UsuarioModel> optionalUsuario = usuarioRepository.findById(id);

        if (optionalUsuario.isEmpty()) {
            return Optional.empty();
        }

        UsuarioModel usuario = optionalUsuario.get();

        // Validar duplicatas apenas se os campos estão sendo alterados
        if (updateDTO.getTelefone() != null &&
                !updateDTO.getTelefone().equals(usuario.getTelefone()) &&
                usuarioRepository.existsByTelefoneAndIdNot(updateDTO.getTelefone(), id)) {
            throw new DuplicateResourceException("Telefone já cadastrado");
        }

        // Aplicar mudanças
        if (updateDTO.getNome() != null) {
            usuario.setNome(updateDTO.getNome());
        }
        if (updateDTO.getTelefone() != null) {
            usuario.setTelefone(updateDTO.getTelefone());
        }

        UsuarioModel usuarioAtualizado = usuarioRepository.save(usuario);
        return Optional.of(modelMapper.map(usuarioAtualizado, UsuarioResponseDTO.class));
    }

    @Transactional
    public boolean deletar(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Métodos de validação
    private void validarEmailUnico(String email) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email já cadastrado: " + email);
        }
    }

    private void validarCpfUnico(String cpf) {
        if (usuarioRepository.existsByCpf(cpf)) {
            throw new DuplicateResourceException("CPF já cadastrado: " + cpf);
        }
    }

    private void validarTelefoneUnico(String telefone) {
        if (usuarioRepository.existsByTelefone(telefone)) {
            throw new DuplicateResourceException("Telefone já cadastrado: " + telefone);
        }
    }
}
