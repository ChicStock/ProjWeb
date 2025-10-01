package com.example.demo.controller;

import com.example.demo.model.LojaModel;
import com.example.demo.service.LojaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/lojas")
@RequiredArgsConstructor
public class LojaController {

    private LojaService lojaService;

    @GetMapping
    public ResponseEntity<List<LojaModel>> listarLojas(){
        return ResponseEntity.ok(lojaService.procurarLojas());
    }

    @PostMapping
    public ResponseEntity<LojaModel> criarLoja(@RequestBody LojaModel lojaModel){
        LojaModel loja = lojaService.criarLoja(lojaModel);
        URI location = URI.create("/lojas" + loja.getId());
        return ResponseEntity.created(location).body(loja);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLoja(@PathVariable Long id){
        Void deletado = lojaService.deletarLoja(id);
        return ResponseEntity.ok().build();
    }
}
