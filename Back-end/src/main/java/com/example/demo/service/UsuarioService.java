package com.example.demo.service;

import com.example.demo.dto.EnderecoDTO;
import com.example.demo.dto.UsuarioRequestDTO;
import com.example.demo.dto.UsuarioResponseDTO;
import com.example.demo.dto.UsuarioUpdateDTO;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.model.EnderecoModel;
import com.example.demo.model.StatusUsuario;
import com.example.demo.model.UsuarioModel;
import com.example.demo.model.enums.UserRole;
import com.example.demo.repository.EnderecoRepository;
import com.example.demo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    public UsuarioResponseDTO buscarPerfil(String email) {
        UsuarioModel usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) throw new RuntimeException("Usuário não encontrado");
        return modelMapper.map(usuario, UsuarioResponseDTO.class);
    }

    @Transactional
    public UsuarioResponseDTO atualizarPerfil(String email, UsuarioUpdateDTO dados) {
        UsuarioModel usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) throw new RuntimeException("Usuário não encontrado");

        if (dados.getNome() != null) usuario.setNome(dados.getNome());
        if (dados.getSobrenome() != null) usuario.setSobrenome(dados.getSobrenome());
        if (dados.getTelefone() != null) usuario.setTelefone(dados.getTelefone());

        if (dados.getEndereco() != null) {
            EnderecoModel enderecoModel = usuario.getEndereco();
            EnderecoDTO enderecoDTO = dados.getEndereco();

            if (enderecoModel == null) {
                enderecoModel = new EnderecoModel();
                enderecoModel.setUsuarioModel(usuario);
                usuario.setEndereco(enderecoModel);
            }

            enderecoModel.setCep(enderecoDTO.getCep());
            enderecoModel.setRua(enderecoDTO.getRua());
            enderecoModel.setNumero(enderecoDTO.getNumero());
            enderecoModel.setComplemento(enderecoDTO.getComplemento());
            enderecoModel.setEstado(enderecoDTO.getEstado());

            enderecoRepository.save(enderecoModel);
        }

        UsuarioModel usuarioSalvo = usuarioRepository.save(usuario);
        return modelMapper.map(usuarioSalvo, UsuarioResponseDTO.class);
    }


    @Transactional
    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO requestDTO) {
        validarEmailUnico(requestDTO.getEmail());
        if (requestDTO.getCpf() != null) validarCpfUnico(requestDTO.getCpf());
        if (requestDTO.getTelefone() != null) validarTelefoneUnico(requestDTO.getTelefone());

        UsuarioModel usuario = modelMapper.map(requestDTO, UsuarioModel.class);
        usuario.setRole(UserRole.USUARIO);
        usuario.setStatus(StatusUsuario.ATIVO);
        usuario.setSenha(passwordEncoder.encode(requestDTO.getSenha()));

        UsuarioModel usuarioSalvo = usuarioRepository.save(usuario);
        return modelMapper.map(usuarioSalvo, UsuarioResponseDTO.class);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(usuario -> modelMapper.map(usuario, UsuarioResponseDTO.class))
                .collect(Collectors.toList());
    }

    public Optional<UsuarioResponseDTO> buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> modelMapper.map(usuario, UsuarioResponseDTO.class));
    }

    @Transactional
    public Optional<UsuarioResponseDTO> atualizarParcialmente(Long id, UsuarioUpdateDTO updateDTO) {
        Optional<UsuarioModel> optionalUsuario = usuarioRepository.findById(id);
        if (optionalUsuario.isEmpty()) return Optional.empty();

        UsuarioModel usuario = optionalUsuario.get();

        if (updateDTO.getTelefone() != null &&
                !updateDTO.getTelefone().equals(usuario.getTelefone()) &&
                usuarioRepository.existsByTelefoneAndIdNot(updateDTO.getTelefone(), id)) {
            throw new DuplicateResourceException("Telefone já cadastrado");
        }

        if (updateDTO.getNome() != null) usuario.setNome(updateDTO.getNome());
        if (updateDTO.getSobrenome() != null) usuario.setSobrenome(updateDTO.getSobrenome());
        if (updateDTO.getTelefone() != null) usuario.setTelefone(updateDTO.getTelefone());

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

    private void validarEmailUnico(String email) {
        if (usuarioRepository.existsByEmail(email)) throw new DuplicateResourceException("Email já cadastrado: " + email);
    }

    private void validarCpfUnico(String cpf) {
        if (usuarioRepository.existsByCpf(cpf)) throw new DuplicateResourceException("CPF já cadastrado: " + cpf);
    }

    private void validarTelefoneUnico(String telefone) {
        if (usuarioRepository.existsByTelefone(telefone)) throw new DuplicateResourceException("Telefone já cadastrado: " + telefone);
    }
}