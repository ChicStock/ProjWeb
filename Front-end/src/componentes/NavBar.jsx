import "./Navbar.css"; 
import Logo1 from "../assets/Logo1.png"   
import { BsBag } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { NavDropdown } from "react-bootstrap"; 


function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-top">
        <img src={Logo1} className="logo1"/>
  
        <div className="search-bar">
          <input
            type="text"
            placeholder="Busque por produto, categoria ou loja..."
          />
          <button>
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="user-actions">
          <span>
            Bem-vindo(a), <b>Usuário</b>
          </span>

            <NavDropdown
             title={<FiChevronDown size={20} />}
             id="basic-nav-dropdown"
             className="user-dropdown"
             >
             <NavDropdown.Item href="#action/3.1">Perfil</NavDropdown.Item>
             <NavDropdown.Item href="#action/3.2">Meus Pedidos</NavDropdown.Item>
             <NavDropdown.Item href="#action/3.3">Cadastre sua loja</NavDropdown.Item>
             <NavDropdown.Divider />
             <NavDropdown.Item href="#action/3.4">Sair</NavDropdown.Item>
             </NavDropdown>

          <BsBag />

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
  );
}

export default Navbar;
 