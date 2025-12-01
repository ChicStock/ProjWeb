package com.example.demo.controller;

import com.example.demo.dto.DashboardDTO;
import com.example.demo.dto.DashboardDTO.GraficoVendasDTO;
import com.example.demo.dto.DashboardDTO.ProdutoEstoqueDTO;
import com.example.demo.dto.PedidoResponseDTO;
import com.example.demo.model.PedidoModel;
import com.example.demo.model.PedidoStatus;
import com.example.demo.model.ProdutoModel;
import com.example.demo.model.UsuarioModel;
import com.example.demo.repository.PedidoRepository;
import com.example.demo.repository.ProdutoRepository;
import com.example.demo.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/dashboard")
@Tag(name = "Dashboard", description = "Dados para o Relatório de Vendas")
@RequiredArgsConstructor
public class DashboardController {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;

    @GetMapping("/resumo")
    @Operation(summary = "Obter dados reais da loja logada")
    public ResponseEntity<DashboardDTO> getDashboardData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UsuarioModel usuario = usuarioRepository.findByEmail(authentication.getName());

        if (usuario == null || usuario.getLoja() == null) {
            return ResponseEntity.ok(new DashboardDTO(null, "Sem Loja", 0.0, 0, 0, List.of(), List.of(), List.of()));
        }

        Long lojaId = usuario.getLoja().getId();
        String nomeLoja = usuario.getLoja().getNome();

        Double faturamento = pedidoRepository.somarFaturamentoPorLoja(lojaId);
        if (faturamento == null) faturamento = 0.0;

        Long pagos = pedidoRepository.contarPedidosPagosEEntregues(lojaId);
        Long pendentes = pedidoRepository.countByLojaIdAndPedidoStatus(lojaId, PedidoStatus.PAGAMENTO_PENDENTE);

        List<Object[]> dadosGraficoRaw = pedidoRepository.buscarProdutosMaisVendidos(lojaId);
        List<GraficoVendasDTO> grafico = dadosGraficoRaw.stream()
                .limit(6)
                .map(obj -> new GraficoVendasDTO((String) obj[0], (Long) obj[1]))
                .collect(Collectors.toList());

        List<PedidoModel> ultimosPedidosModel = pedidoRepository.buscarUltimosPedidos(lojaId, PageRequest.of(0, 10));
        List<PedidoResponseDTO> listaPedidos = ultimosPedidosModel.stream()
                .map(p -> {
                    String resumo = p.getProdutos().stream()
                            .map(ProdutoModel::getNome).limit(2).collect(Collectors.joining(", "));
                    if (p.getProdutos().size() > 2) resumo += "...";

                    String nomeCliente = "Cliente";
                    String telefoneCliente = "";
                    if (p.getUsuario() != null) {
                        nomeCliente = p.getUsuario().getNome() + " " + p.getUsuario().getSobrenome();
                        telefoneCliente = p.getUsuario().getTelefone();
                    }

                    return PedidoResponseDTO.builder()
                            .id(p.getId())
                            .valorTotal(p.getValorTotal())
                            .pedidoStatus(p.getPedidoStatus())
                            .data(p.getData())
                            .nomeCliente(nomeCliente)
                            .telefoneCliente(telefoneCliente)
                            .resumoItens(resumo.isEmpty() ? "Sem itens" : resumo)
                            .build();
                })
                .collect(Collectors.toList());

        List<ProdutoModel> produtosLoja = produtoRepository.findByLojaId(lojaId);
        List<ProdutoEstoqueDTO> listaEstoque = produtosLoja.stream()
                .map(prod -> new ProdutoEstoqueDTO(
                        prod.getId(),
                        prod.getNome(),
                        prod.getCategoria() != null ? prod.getCategoria().getNome() : "Geral",
                        prod.getPreco() != null ? prod.getPreco().doubleValue() : 0.0,
                        prod.getQuantidade() != null ? prod.getQuantidade() : 0,
                        prod.getDescricao()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new DashboardDTO(
                lojaId,
                nomeLoja,
                faturamento,
                pagos.intValue(),
                pendentes.intValue(),
                grafico,
                listaPedidos,
                listaEstoque
        ));
    }
}