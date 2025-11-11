import { useState } from "react";
import "./Navbar.css"; 
import Logo2 from "../assets/Logo2.png"   
import { BsBag } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import { NavDropdown, Offcanvas, Button, Card    } from "react-bootstrap"; 


function Navbar() {
  const [showSacola, setShowSacola] = useState(false);

  const handleClose = () => setShowSacola(false);
  const handleShow = () => setShowSacola(true);

 return (
  <> 
    <header className="navbar"> 
      <div className="navbar-top">
        <div className="logo-container">
        <img src={Logo2} alt="Logo" className="logo2" />
        </div>
          
        <div className="search-bar">
          <input
            type="text"
            placeholder="Busque por produto, categoria ou loja..."
          />
          <button>
            <IoMdSearch/>
          </button>
        </div>

        <div className="user-actions">
          <span>
            Bem-vindo(a), <b>Usuário</b>
          </span>

            <NavDropdown
            id="basic-nav-dropdown"
            className="user-dropdown"
            rootClose
            >
              <NavDropdown.Item href="#action/3.1">Perfil</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Meus Pedidos</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Cadastre sua loja</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Sair</NavDropdown.Item>
              
            </NavDropdown>

            <BsBag 
            size={22} 
            className="ms-3 cursor-pointer" 
            onClick={handleShow} 
            />
          </div>
        </div>


      <nav className="navbar-bottom">
        <a href="#">Jeans</a>
        <a href="#">Feminino</a>
        <a href="#">Masculino</a>
        <a href="#">Infantil</a>
        <a href="#">Moda praia</a>
        <a href="#">Esportivo</a>
        <a href="#">Beleza</a>
      </nav>
    </header>

      <Offcanvas show={showSacola} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>SACOLA</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Card className="p-3 shadow-sm">
            <h6>
              NERD’S – SOROCABA {" "}
              <span className="text-muted float-end">Ver Loja</span>
              </h6>

            <div className="d-flex justify-content-between mt-3">
              <p>1x Blusa do Goku</p>
              <p>R$ 47,00</p>
            </div>

            <p className="text-muted small">
              Blusa feita de algodão com costura feita à mão e com o desenho do personagem Goku.
            </p>

            <hr />

            <div className="d-flex justify-content-between">
              <span>Sub Total</span>
              <span>R$ 47,00</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Taxa de Serviço</span>
              <span>R$ 0,99</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Taxa de Entrega</span>
              <span className="text-success">Grátis</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>R$ 47,99</span>
            </div>

            <Button className="w-100 mt-3 btn-pagamento">
              Fechar Pedido
            </Button>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      </>
  );
}


export default Navbar;
 