import React from "react";
import Navbar from "./NavBar";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./FinalizarPedido.css";

function FinalizarPedido() {
  return (
    <>
      <Navbar />
      <Container className="finalize-container mt-4">
        <h2 className="finalize-header">Finalize Seu Pedido</h2>

        <div className="tabs">
          <span className="tab active">Entrega</span>
          <span className="tab">Retirada</span>
        </div>

        <Row className="mt-3">

          <Col md={6}>
            <div className="endereco-section">
              <div className="endereco-info">
                <div className="endereco-texto">
                  <i className="bi bi-geo-alt-fill"></i>
                  <span className="endereco-titulo">Av. Engenheiro Santana Júnior</span>
              </div>
              <button className="trocar-btn">Trocar</button>
            </div>
            
          <p className="tempo-info">Hoje 10–20 min</p>
          
          
          <Card className="opcao-card">
            <div className="opcao-header">
              <h5>Padrão</h5>
              <p className="opcao-tempo">Hoje 10–20 min</p>
            </div>
            <p className="opcao-preco gratis">Grátis</p>
            
        <Button variant="outline-secondary" size="sm">
          Selecionar
        </Button>
          </Card>
          
        <Card className="opcao-card">
          <div className="opcao-header">
            <h5>Fast</h5>
            <p className="opcao-tempo">Hoje 5–10 min</p>
          </div>
          <p className="opcao-preco">R$ 7,99</p>
            <Button variant="outline-secondary" size="sm">
            Selecionar
            </Button>
        </Card>
        
        <Button className="mt-3 btn-pagamento">
          Selecionar Forma de Pagamento
        </Button>
      </div>
         </Col>
    
          <Col md={6}>
            <Card className="resumo-card shadow-sm">
              <h5 className="resumo-loja">
                NERD’S – SOROCABA <span className="ver-loja">Ver Loja</span>
              </h5>

              <div className="resumo-item">
                <p>1x Blusa do Goku</p>
                <span>R$ 47,00</span>
              </div>

              <p className="descricao">
                Blusa feita de algodão com costura feita à mão e com o desenho
                do personagem Goku.
              </p>

              <hr />

              <div className="resumo-linha">
                <span>Sub Total</span>
                <span>R$ 47,00</span>
              </div>
              <div className="resumo-linha">
                <span>Taxa de Serviço</span>
                <span>R$ 0,99</span>
              </div>
              <div className="resumo-linha">
                <span>Taxa de Entrega</span>
                <span className="gratis">Grátis</span>
              </div>

              <hr />

              <div className="resumo-total">
                <strong>Total</strong>
                <strong>R$ 47,99</strong>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default FinalizarPedido;
