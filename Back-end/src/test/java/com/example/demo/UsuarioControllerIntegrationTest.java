package com.example.demo;

import com.example.demo.dto.UsuarioRequestDTO; // Corrigido o import
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UsuarioControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void deveCriarUsuarioComSucesso() throws Exception {
        UsuarioRequestDTO request = new UsuarioRequestDTO();
        request.setNome("João");
        request.setSobrenome("Silva");
        request.setEmail("joao@email.com");
        request.setSenha("MinhaSenh@123");
        request.setCpf("12345678901");
        request.setTelefone("85999999999");

        mockMvc.perform(post("/api/v1/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("João"))
                .andExpect(jsonPath("$.email").value("joao@email.com")); // Corrigido andExpected para andExpect
    }
}
