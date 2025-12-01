package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.LojaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/lojas")
@RequiredArgsConstructor
@Tag(name = "Lojas", description = "Gerenciamento de lojas")
public class LojaController {

    private final LojaService lojaService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Criar nova loja com foto")
    public ResponseEntity<LojaResponseDTO> criarLoja(
            @RequestParam("nome") String nome,
            @RequestParam("cnpj") String cnpj,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem
    ) {
        try {
            String imgUrl = null;

            if (imagem != null && !imagem.isEmpty()) {
                Path diretorio = Paths.get("uploads");
                if (!Files.exists(diretorio)) {
                    Files.createDirectories(diretorio);
                }

                String nomeArquivo = UUID.randomUUID() + "_" + imagem.getOriginalFilename();

                Path caminhoArquivo = diretorio.resolve(nomeArquivo);

                Files.copy(imagem.getInputStream(), caminhoArquivo, StandardCopyOption.REPLACE_EXISTING);

                imgUrl = "/imagens/" + nomeArquivo;
            }

            LojaRequestDTO requestDTO = new LojaRequestDTO();
            requestDTO.setNome(nome);
            requestDTO.setCnpj(cnpj);
            requestDTO.setImgUrl(imgUrl);

            LojaResponseDTO loja = lojaService.criarLoja(requestDTO);

            URI location = URI.create("/api/v1/lojas/" + loja.getId());
            return ResponseEntity.created(location).body(loja);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    @Operation(summary = "Listar lojas ativas")
    public ResponseEntity<List<LojaResponseDTO>> listarLojasAtivas() {
        List<LojaResponseDTO> lojas = lojaService.listarTodasAtivas();
        return ResponseEntity.ok(lojas);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar loja por ID")
    public ResponseEntity<LojaResponseDTO> buscarPorId(@PathVariable Long id) {
        Optional<LojaResponseDTO> loja = lojaService.buscarPorId(id);
        return loja.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Atualizar loja com foto")
    public ResponseEntity<LojaResponseDTO> atualizarLoja(
            @PathVariable Long id,
            @RequestParam("nome") String nome,
            @RequestParam("cnpj") String cnpj,
            @RequestParam(value = "descricao", required = false) String descricao,
            @RequestParam(value = "endereco", required = false) String endereco,
            @RequestParam(value = "telefone", required = false) String telefone,
            @RequestParam(value = "entrega", required = false) String entrega,
            @RequestParam(value = "pagamento", required = false) String pagamento,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem
    ) {
        try {
            String imgUrl = salvarImagem(imagem);

            LojaRequestDTO requestDTO = new LojaRequestDTO();
            requestDTO.setNome(nome);
            requestDTO.setCnpj(cnpj);
            requestDTO.setDescricao(descricao);
            requestDTO.setEndereco(endereco);
            requestDTO.setTelefone(telefone);
            requestDTO.setEntrega(entrega);
            requestDTO.setPagamento(pagamento);

            if (imgUrl != null) {
                requestDTO.setImgUrl(imgUrl);
            }

            Optional<LojaResponseDTO> atualizada = lojaService.atualizarLoja(id, requestDTO);
            return atualizada.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String salvarImagem(MultipartFile imagem) throws IOException {
        if (imagem != null && !imagem.isEmpty()) {
            Path diretorio = Paths.get("uploads");
            if (!Files.exists(diretorio)) {
                Files.createDirectories(diretorio);
            }
            String nomeArquivo = UUID.randomUUID() + "_" + imagem.getOriginalFilename();
            Path caminhoArquivo = diretorio.resolve(nomeArquivo);
            Files.copy(imagem.getInputStream(), caminhoArquivo, StandardCopyOption.REPLACE_EXISTING);
            return "/imagens/" + nomeArquivo;
        }
        return null;
    }

    @PatchMapping("/{id}/desativar")
    @Operation(summary = "Desativar loja")
    public ResponseEntity<Void> desativarLoja(@PathVariable Long id) {
        boolean desativada = lojaService.desativarLoja(id);
        return desativada ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}