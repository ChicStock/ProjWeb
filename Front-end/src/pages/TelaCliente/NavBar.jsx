import React, { useState, useEffect } from "react";
import "./Navbar.css"; 
import Logo2 from "../../assets/Logo1.png"; 
import { FiSearch, FiShoppingBag, FiUser, FiLogOut, FiX, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { useCart } from "./Carrinho";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, removeFromCart, cartTotal, cartCount } = useCart();
  
  const [menuAberto, setMenuAberto] = useState(false);
  const [sacolaAberta, setSacolaAberta] = useState(false);

  const [usuarioLogado, setUsuarioLogado] = useState(() => !!localStorage.getItem('authToken'));
  const [temLoja, setTemLoja] = useState(() => !!localStorage.getItem('lojaId'));

  useEffect(() => {
    const verificarAuth = () => {
        const token = localStorage.getItem('authToken');
        const lojaId = localStorage.getItem('lojaId');
        setUsuarioLogado(!!token);
        setTemLoja(!!lojaId);
    };

    window.addEventListener('auth-update', verificarAuth);
    window.addEventListener('storage', verificarAuth);

    return () => {
        window.removeEventListener('auth-update', verificarAuth);
        window.removeEventListener('storage', verificarAuth);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('lojaId'); 
    
    window.dispatchEvent(new Event('auth-update'));
    
    setMenuAberto(false);
    navigate('/');
  };

  return (
    <>
      <header className="navbar-wrapper">
        <div className="navbar-container">
          
          <div className="logo-area">
            <Link to="/">
               <img src={Logo2} alt="Logo" className="logo-img" />
            </Link>
          </div>
            
          <div className="search-area">
            <input type="text" placeholder="Busque por loja..." />
            <button><FiSearch /></button>
          </div>

          <div className="user-area">
            {usuarioLogado ? (
               <div className="conta-box" onClick={() => setMenuAberto(!menuAberto)}>
                  <span className="user-welcome">Minha Conta</span>
                  <div className="user-avatar"> <FiUser /> </div>
                  
                  {menuAberto && (
                      <div className="nav-dropdown-menu">
                          <Link to="/perfil" onClick={() => setMenuAberto(false)}>Perfil</Link>
                          <Link to="/MeusPedidos" onClick={() => setMenuAberto(false)}>Meus Pedidos</Link>
                          
                          <div className="nav-divider"></div>

                          {temLoja ? (
                              <Link to="/RelatorioVendas" onClick={() => setMenuAberto(false)}>
                                  Painel Lojista
                              </Link>
                          ) : (
                              <Link to="/CadastrarLoja" onClick={() => setMenuAberto(false)}>
                                  Abra sua Loja
                              </Link>
                          )}
                          
                          <div className="nav-divider"></div>
                          
                          <button onClick={handleLogout} className="btn-nav-logout">
                              <FiLogOut /> Sair
                          </button>
                      </div>
                  )}
               </div>
            ) : (
               <Link to="/login" className="btn-nav-login">Entrar</Link>
            )}

            <div className="bag-icon" onClick={() => setSacolaAberta(true)}>
               <FiShoppingBag size={22} />
               {cartCount > 0 && <span className="bag-badge">{cartCount}</span>}
            </div>
          </div>
        </div>

        <nav className="bottom-links">
          <Link to="#">Feminino</Link>
          <Link to="#">Masculino</Link>
          <Link to="#">Infantil</Link>
          <Link to="#">Jeans</Link>
          <Link to="#">Moda Praia</Link>
        </nav>
      </header>

      <div 
        className={`sacola-overlay ${sacolaAberta ? 'visivel' : ''}`} 
        onClick={() => setSacolaAberta(false)}
      ></div>

      <div className={`sacola-sidebar ${sacolaAberta ? 'aberta' : ''}`}>
        <div className="sacola-header">
            <h3>Sua Sacola ({cartCount})</h3>
            <button onClick={() => setSacolaAberta(false)} className="btn-fechar-sacola">
                <FiX size={24}/>
            </button>
        </div>

        <div className="sacola-body">
            {cartItems.length > 0 ? (
                cartItems.map((item) => (
                    <div key={`${item.id}-${item.tamanho}`} className="sacola-item">
                        <div className="sacola-item-info">
                            <h4>{item.nome}</h4>
                            <div className="sacola-detalhes-sub">
                                <span>{item.lojaNome}</span>
                                <span className="badge-tam">{item.tamanho}</span>
                                <span className="badge-qtd">x{item.quantidade}</span>
                            </div>
                            <strong>
                                {(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </strong>
                        </div>
                        <button 
                            className="btn-trash"
                            onClick={() => removeFromCart(item.id, item.tamanho)}
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                ))
            ) : (
                <div className="sacola-vazia">
                    <FiShoppingBag size={40} color="#ddd"/>
                    <p>Sua sacola está vazia.</p>
                </div>
            )}
        </div>

        <div className="sacola-footer">
            <div className="resumo-linha">
                <span>Total</span>
                <strong>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
            </div>
            <button 
                className="btn-finalizar" 
                onClick={() => {
                    setSacolaAberta(false);
                    navigate("/FinalizarPedido");
                }}
                disabled={cartItems.length === 0}
            >
                Fechar Pedido
            </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;