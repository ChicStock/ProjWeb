import { useState } from "react";
import "./Navbar.css"; 
import Logo2 from "../../assets/Logo2.png";   
import { BsBag } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import { NavDropdown, Offcanvas, Button, Card } from "react-bootstrap"; 
import { Link, useNavigate } from "react-router-dom"; 

function Navbar() {
  const [showSacola, setShowSacola] = useState(false);
  
  const navigate = useNavigate();

  const handleClose = () => setShowSacola(false);
  const handleShow = () => setShowSacola(true);

  const irParaFinalizarPedido = () => {
    handleClose();
    navigate("/FinalizarPedido");
  };

  return (
    <> 
      <header className="navbar"> 
        <div className="navbar-top">
          <div className="logo-container">
            <Link to="/Telainicial">
                <img src={Logo2} alt="Logo" className="logo2" />
            </Link>
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
              title="Minha Conta" 
              id="basic-nav-dropdown"
              className="user-dropdown"
            >
              <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/meus-pedidos">Meus Pedidos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/CadastrarLoja">Cadastre sua loja</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/login">Sair</NavDropdown.Item>
            </NavDropdown>

            <BsBag 
              size={22} 
              className="ms-3" 
              style={{ cursor: "pointer" }}
              onClick={handleShow} 
            />
          </div>
        </div>

        <nav className="navbar-bottom">
          <Link to="#">Jeans</Link>
          <Link to="#">Feminino</Link>
          <Link to="#">Masculino</Link>
          <Link to="#">Infantil</Link>
          <Link to="#">Moda praia</Link>
          <Link to="#">Esportivo</Link>
          <Link to="#">Beleza</Link>
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
              <span className="text-muted float-end" style={{ fontSize: '0.8rem' }}>Ver Loja</span>
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

            <Button 
                className="w-100 mt-3 btn-pagamento" 
                variant="primary"
                onClick={irParaFinalizarPedido}
            >
              Fechar Pedido
            </Button>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Navbar;