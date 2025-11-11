import React from "react";
import { Container, Button, Form, Card } from "react-bootstrap";
import "./FinalizarPedido.css";

function TrocarEndereco() {
  return (
    <Container className="finalize-container-center mt-5">
      <h2 className="finalize-header">Trocar Endereço</h2>

      <Card className="p-4">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Rua</Form.Label>
            <Form.Control placeholder="Digite o nome da rua" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bairro</Form.Label>
            <Form.Control placeholder="Ex: Centro" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Número</Form.Label>
            <Form.Control placeholder="Ex: 123" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cidade</Form.Label>
            <Form.Control placeholder="Digite a cidade" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Complemento</Form.Label>
            <Form.Control placeholder="Apto, bloco, ponto de referência..." />
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button
              variant="outline-secondary"
              onClick={() => (window.location.href = "/")}
            >
              Cancelar
            </Button>
            <Button
              className="btn-pagamento"
              onClick={() => (window.location.href = "/")}
            >
              Salvar Endereço
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default TrocarEndereco;
