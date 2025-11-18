import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {BsClock, BsGeoAlt, BsTelephone,BsEnvelope,BsInstagram} from "react-icons/bs";
import Navbar from "./NavBar";
import Loja2 from "../../assets/Loja2.png";
import "./TelaLoja.css";

function TelaLoja() {
  return (
    <>
      <Navbar />

      <Container className="tela-loja mt-5 mb-5">
        <Row className="align-items-center justify-content-center text-center text-md-start">
          <Col xs={12} md={4} className="text-center">
            <img
              src={Loja2}
              alt="Logo da Loja"
              className="img-fluid loja-logo rounded shadow"
            />
          </Col>

          <Col xs={12} md={8}>
            <h1 className="loja-nome mb-2">Nerd’s</h1>
            <p className="loja-slogan">
              Vista seu universo. Seja geek com estilo!
            </p>
          </Col>
        </Row>

       
        <Row className="info-section mt-4">
          <Col md={6} className="info-bloco">
            <p className="info-titulo">
              <BsGeoAlt className="me-2 icon" />
              Endereço:
            </p>
            <p>
              Rua dos Pixels, 404 – Bairro Galáxia Central
              <br />
              São Paulo – SP
              <br />
              CEP: 01234-789
            </p>
          </Col>

          <Col md={6} className="info-bloco">
            <p className="info-titulo">
              <BsClock className="me-2 icon" />
              Atendimento:
            </p>
            <p>Segunda a sábado, das 10h às 19h</p>
          </Col>
        </Row>

        <hr className="divider" />

        
        <Row className="contato-section">
          <Col md={12}>
            <p>
              <BsTelephone className="me-2 icon" />
              Contato/WhatsApp: (11) 99876-5432
            </p>
            <p>
              <BsEnvelope className="me-2 icon" />
              E-mail: contato@nerdsgeekstore.com.br
            </p>
            <p>
              <BsInstagram className="me-2 icon" />
              Instagram: @nerdsgeekstore
            </p>
          </Col>
        </Row>

    
        <div className="catalogo mt-5">
          <h3 className="catalogo-titulo">Catálogo</h3>

          <div className="produto-card">
            <div className="produto-img" />
            <div className="produto-info">
              <p className="produto-nome">Blusa do Goku</p>
              <p className="produto-detalhes">Cores: — | Tamanho: —</p>
            </div>
            <div className="produto-extra">
              <p className="produto-id">ID: 2233441</p>
              <p className="produto-preco">R$ 47,00</p>
            </div>
          </div>

          <div className="produto-card">
            <div className="produto-img" />
            <div className="produto-info">
              <p className="produto-nome">Blusa do Pikachu</p>
              <p className="produto-detalhes">Cores: — | Tamanho: —</p>
            </div>
            <div className="produto-extra">
              <p className="produto-id">ID: 4455332</p>
              <p className="produto-preco">R$ 55,00</p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default TelaLoja;
