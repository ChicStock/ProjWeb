import "./Navbar.css"; 
import Logo2 from "../../assets/Logo2.png"   
import { BsBag } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import { NavDropdown } from "react-bootstrap"; 
import { Link } from "react-router-dom"; // 1. Importe o Link

function Navbar() {

  return (
    <header className="navbar"> 
      <div className="navbar-top">
        <div className="logo-container">
        {/* Link na logo para voltar para home */}
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
            {/* Removi o <i> antigo para deixar só o ícone do React Icons */}
            <IoMdSearch/>
          </button>
        </div>

        <div className="user-actions">
          <span>
            Bem-vindo(a), <b>Usuário</b>
          </span>

            {/* 2. Removi o 'rootClose' e adicionei um 'title' obrigatório */}
            <NavDropdown
            title="Minha Conta" 
            id="basic-nav-dropdown"
            className="user-dropdown"
            >
              {/* 3. Usando as={Link} para não recarregar a página */}
              <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/meus-pedidos">Meus Pedidos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/CadastrarLoja">Cadastre sua loja</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/login">Sair</NavDropdown.Item>
              
            </NavDropdown>
              
          <BsBag />

        </div>
      </div>

    
      <nav className="navbar-bottom">
        {/* O ideal é trocar esses <a> por <Link> também futuramente */}
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