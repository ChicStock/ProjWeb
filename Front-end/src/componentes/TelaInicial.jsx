import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import Navbar from "./NavBar";
import "./TelaInicial.css";

import Loja1 from "../assets/Loja1.png";
import Loja2 from "../assets/Loja2.png";
import Loja3 from "../assets/Loja3.png";
import Loja4 from "../assets/Loja4.png";
import Loja5 from "../assets/Loja5.png";
import Loja6 from "../assets/Loja6.png";
import ChicStock from "../assets/ChicStock.png";
import Cadastre from "../assets/Cadastre.png";

function TelaInicial() {
  return (
    <>
      <Navbar/>

      <Carousel fade interval={3000} className="carousel-principal">
        <Carousel.Item>
          <img className="d-block w-100" src={Loja4} alt="Loja 4" />
        </Carousel.Item>

        <Carousel.Item>
          <img className="d-block w-100" src={Loja5} alt="Loja 5" />
        </Carousel.Item>

        <Carousel.Item>
          <img className="d-block w-100" src={Loja6} alt="Loja 6" />
        </Carousel.Item>

        <Carousel.Item>
          <img className="d-block w-100" src={ChicStock} alt="ChicStock" />
        </Carousel.Item>
      </Carousel>

    
      <Container className="my-5 novidades">
        <h2 className="text-center mb-4">Novidades</h2>
        <Row className="g-4 text-center">

          <Col md={4}>
            <img src={Loja1} alt="Loja 1" className="img-fluid rounded shadow" />
          </Col>

          <Col md={4}>
            <img src={Loja2} alt="Loja 2" className="img-fluid rounded shadow" />
          </Col>
          
          <Col md={4}>
            <img src={Loja3} alt="Loja 3" className="img-fluid rounded shadow" />
          </Col>
        </Row>
      </Container>

  
      <div className="cadastro-section text-center">
        <img src={Cadastre} alt="Cadastre sua loja" className="img-fluid cadastro-img" />
      </div>
    </>
  );
}

export default TelaInicial;
