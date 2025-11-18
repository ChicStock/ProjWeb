import React from "react";
import Navbar from "./NavBar";
import { Container } from "react-bootstrap";
import "./MeusPedidos.css";

function MeusPedidos() {
  return (
    <>
      <Navbar />
      <Container className="meus-pedidos-container mt-4">
        <h2 className="meus-pedidos-header">← Meus Pedidos</h2>

        <div className="pedido-card shadow">
          <div className="produto-id canto">ID: 2896542</div>

          <div className="produto-header">
            <h3 className="produto-nome">Blusa do Goku</h3>
            <p className="sub-info">Previsão de entrega: 11/05/2025</p>
            <p className="sub-info">Loja: Nerd's</p>
            <p className="sub-info">Tamanho: M</p>
          </div>

          <div className="produto-conteudo">
            <div className="produto-imagem-placeholder">
              <img
                className="produto-img"
              />
            </div>

            <div className="produto-info">
              <div className="produto-preco">
                <label>Valor:</label> <span>R$ 47,00</span>
              </div>
            </div>
          </div>
        </div>


        <div className="pedido-card shadow">
          <div className="produto-id canto">ID: 27563816</div>

          <div className="produto-header">
            <h3 className="produto-nome">Calça X</h3>
            <p className="sub-info">Entregue em: 30/04/2025</p>
            <p className="sub-info">Loja: Max Maize</p>
            <p className="sub-info">Tamanho: 42</p>
          </div>

          <div className="produto-conteudo">
            <div className="produto-imagem-placeholder">
              <img
                className="produto-img"
              />
            </div>

            <div className="produto-info">
              <div className="produto-preco">
                <label>Valor:</label> <span>R$ 95,00</span>
              </div>
            </div>
          </div>
        </div>

      </Container>
    </>
  );
}

export default MeusPedidos;
