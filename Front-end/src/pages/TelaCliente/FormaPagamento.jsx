import React from "react";
import { Container, Button, Form, Card } from "react-bootstrap";
import "./FinalizarPedido.css";

function FormaPagamento() {
  return (

    
    <Container className="finalize-container mt-4">
      <h2 className="finalize-header">Forma de Pagamento</h2>

      <Card className="p-4">
        <Form>
          <Form.Check type="radio" label="Cartão de Crédito" name="pagamento" defaultChecked />
          <Form.Check type="radio" label="Cartão de Débito" name="pagamento" />
          <Form.Check type="radio" label="Pix" name="pagamento" />
          <Form.Check type="radio" label="Dinheiro" name="pagamento" />
        </Form>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="outline-secondary" onClick={() => (window.location.href = "/FinalizarPedido")}>
            Voltar
          </Button>
          <Button className="btn-pagamento">Confirmar Pagamento</Button>
        </div>
      </Card>
    </Container>
  );
}

export default FormaPagamento;
