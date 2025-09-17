package com.example.demo.controller;

import com.example.demo.model.UsuarioModel;
import com.example.demo.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioModel>> listarTodos(){
        List<UsuarioModel> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<UsuarioModel>> listarPorId(@PathVariable Long id){
        Optional<UsuarioModel> optional = usuarioService.listarPorId(id);
        if (optional.isPresent()){
            return ResponseEntity.ok().body(optional);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }


    @PostMapping
    public ResponseEntity<UsuarioModel> criarUsuario(@RequestBody UsuarioModel usuarioModel){
        usuarioModel = usuarioService.criarUsuario(usuarioModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioModel);
    }

    @DeleteMapping("/{id}")
    public void deletarPorId(@PathVariable Long id){
        usuarioService.deletarPorId(id);
    }
}
