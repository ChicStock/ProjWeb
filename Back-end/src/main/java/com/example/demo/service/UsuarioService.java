package com.example.demo.service;

import com.example.demo.model.UsuarioModel;
import com.example.demo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioModel criarUsuario(UsuarioModel usuarioModel){
        return usuarioRepository.save(usuarioModel);
    }

    public List<UsuarioModel> listarTodos(){
        return usuarioRepository.findAll();
    }

    public Optional<UsuarioModel> listarPorId(Long id){
        return usuarioRepository.findById(id);
    }

    public void deletarPorId(Long id){
        usuarioRepository.deleteById(id);
    }
}
