package com.example.demo.service;

import com.example.demo.model.LojaModel;
import com.example.demo.repository.LojaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LojaService {

    private LojaRepository lojaRepository;

    public List<LojaModel> procurarLojas(){
        return lojaRepository.findAll();
    }

    public LojaModel criarLoja(LojaModel lojaModel){
        return lojaRepository.save(lojaModel);
    }


    public Void deletarLoja(Long id){
        lojaRepository.deleteById(id);
        return null;
    }
}
