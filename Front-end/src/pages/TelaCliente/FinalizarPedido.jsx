import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./FinalizarPedido.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMapPin, FiTruck, FiCreditCard, FiShoppingBag, FiCheckCircle, FiX, FiAlertCircle } from "react-icons/fi";
import { MdPix } from "react-icons/md";
import { useCart } from "./Carrinho";

function FinalizarPedido() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [tipoEntrega, setTipoEntrega] = useState("padrao");
  const [metodoPagamento, setMetodoPagamento] = useState("PAGAMENTO_PENDENTE");
  
  const [modalEnderecoOpen, setModalEnderecoOpen] = useState(false);
  const [endereco, setEndereco] = useState({
      rua: "Carregando...", numero: "", bairro: "", cidade: "", uf: "", cep: ""
  });
  const [tempEndereco, setTempEndereco] = useState({ ...endereco });
  const frete = tipoEntrega === "fast" ? 7.99 : 0.00;
  const taxaServico = 0.99;
  const totalFinal = cartTotal + frete + taxaServico;

  useEffect(() => {
      const fetchUsuario = async () => {
          const token = localStorage.getItem('authToken');
          if(!token) { navigate('/login'); return; }

          try {
              const response = await axios.get('http://localhost:8080/api/v1/usuarios/me', {
                  headers: { Authorization: `Bearer ${token}` }
              });
              setUsuario(response.data);
              
              if(response.data.endereco) {
                  const end = response.data.endereco;
                  const enderecoFormatado = {
                      rua: end.rua || "",
                      numero: end.numero || "",
                      bairro: end.bairro || "",
                      cidade: end.cidade || "",
                      uf: end.estado || "",
                      cep: end.cep || ""
                  };
                  setEndereco(enderecoFormatado);
                  setTempEndereco(enderecoFormatado);
              } else {
                  setEndereco({ ...endereco, rua: "Nenhum endereço cadastrado" });
              }
          } catch (error) {
              console.error("Erro ao carregar usuário", error);
          }
      };
      fetchUsuario();
  }, [navigate]);

  const handleFinalizar = async () => {
      if (!usuario || !usuario.id) {
          alert("Erro ao identificar usuário.");
          return;
      }

      if (cartItems.length === 0) return;

      setLoading(true);
      const token = localStorage.getItem('authToken');

      try {
          const pedidosPorLoja = {};

          cartItems.forEach(item => {
              const idLoja = item.lojaId;
              if (!pedidosPorLoja[idLoja]) {
                  pedidosPorLoja[idLoja] = {
                      lojaId: idLoja,
                      itens: [],
                      subtotal: 0
                  };
              }
              pedidosPorLoja[idLoja].itens.push({
                  id: item.id,
                  quantidade: item.quantidade
              });
              pedidosPorLoja[idLoja].subtotal += (item.preco * item.quantidade);
          });

          const promessasDeEnvio = Object.values(pedidosPorLoja).map(grupo => {
              
              const payload = {
                  usuarioId: usuario.id,
                  lojaId: grupo.lojaId,
                  valorTotal: grupo.subtotal + (frete / Object.keys(pedidosPorLoja).length) + taxaServico,
                  data: new Date().toISOString(),
                  pedidoStatus: "PAGAMENTO_PENDENTE",
                  produtos: grupo.itens
              };

              return axios.post('http://localhost:8080/api/v1/pedidos', payload, {
                  headers: { Authorization: `Bearer ${token}` }
              });
          });

          await Promise.all(promessasDeEnvio);

          alert("Pedido realizado com sucesso!");
          clearCart();
          navigate("/MeusPedidos");

      } catch (error) {
          console.error("Erro ao finalizar pedido:", error);
          alert("Ocorreu um erro ao processar seu pedido. Tente novamente.");
      } finally {
          setLoading(false);
      }
  };

  if (cartItems.length === 0) {
      return (
          <div className="checkout-empty-state">
              <Navbar />
              <div className="empty-content">
                  <FiShoppingBag size={50} />
                  <h2>Seu carrinho está vazio</h2>
                  <button onClick={() => navigate("/")}>Voltar às compras</button>
              </div>
          </div>
      )
  }

  return (
    <div className="checkout-page-wrapper">
      <Navbar />
      
      <div className="checkout-container">
        <h1 className="checkout-title">Finalizar Pedido</h1>

        <div className="checkout-grid">
          
          <div className="checkout-left-col">
            
            <div className="checkout-section-title">Endereço de Entrega</div>
            <div className="checkout-card address-card">
                <div className="address-content">
                    <div className="icon-box"><FiMapPin /></div>
                    <div>
                        <p className="address-text">
                            {endereco.rua !== "Nenhum endereço cadastrado" 
                                ? `${endereco.rua}, ${endereco.numero}` 
                                : "Nenhum endereço cadastrado"}
                        </p>
                        <p className="address-sub">
                            {endereco.bairro} {endereco.cidade ? `- ${endereco.cidade}/${endereco.uf}` : ""}
                        </p>
                        <p className="address-sub">{endereco.cep}</p>
                    </div>
                </div>
                <button className="btn-link" onClick={() => setModalEnderecoOpen(true)}>Alterar</button>
            </div>

            <div className="checkout-section-title">Opções de Envio</div>
            <div 
                className={`option-card ${tipoEntrega === 'padrao' ? 'selected' : ''}`}
                onClick={() => setTipoEntrega('padrao')}
            >
                <div className="radio-circle"></div>
                <div className="option-info">
                    <h4>Entrega Padrão</h4>
                    <span>40-60 min</span>
                </div>
                <div className="option-price gratis">Grátis</div>
            </div>
            <div 
                className={`option-card ${tipoEntrega === 'fast' ? 'selected' : ''}`}
                onClick={() => setTipoEntrega('fast')}
            >
                <div className="radio-circle"></div>
                <div className="option-info">
                    <h4>Entrega Flash ⚡</h4>
                    <span>15-20 min</span>
                </div>
                <div className="option-price">R$ 7,99</div>
            </div>

            <div className="checkout-section-title">Forma de Pagamento</div>
            <div className="payment-options">
                <div 
                    className={`payment-method ${metodoPagamento === 'PAGAMENTO_PENDENTE' ? 'active' : ''}`}
                    onClick={() => setMetodoPagamento('PAGAMENTO_PENDENTE')}
                >
                    <MdPix size={24} />
                    <span>Pix</span>
                    {metodoPagamento === 'PAGAMENTO_PENDENTE' && <FiCheckCircle className="check-icon"/>}
                </div>
                <div 
                    className={`payment-method ${metodoPagamento === 'CARTAO' ? 'active' : ''}`}
                    onClick={() => setMetodoPagamento('CARTAO')}
                >
                    <FiCreditCard size={24} />
                    <span>Cartão</span>
                    {metodoPagamento === 'CARTAO' && <FiCheckCircle className="check-icon"/>}
                </div>
            </div>
          </div>

          <div className="checkout-right-col">
            <div className="summary-card">
                <h3>Resumo do Pedido</h3>
                
                <div className="summary-items-list">
                    {cartItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="summary-item">
                            <div className="item-qty">{item.quantidade}x</div>
                            <div className="item-name">
                                {item.nome}
                                <span className="item-size">Tam: {item.tamanho}</span>
                                <span className="item-store-tiny">Vendido por: {item.lojaNome}</span>
                            </div>
                            <div className="item-price">
                                {(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="divider"></div>

                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="summary-row">
                    <span>Taxa de Serviço</span>
                    <span>R$ 0,99</span>
                </div>
                <div className="summary-row">
                    <span>Entrega</span>
                    <span className={frete === 0 ? 'gratis' : ''}>
                        {frete === 0 ? 'Grátis' : `R$ ${frete.toString().replace('.', ',')}`}
                    </span>
                </div>

                <div className="divider"></div>

                <div className="summary-total">
                    <span>Total</span>
                    <span>{totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>

                <button className="btn-confirmar-pedido" onClick={handleFinalizar} disabled={loading}>
                    {loading ? "Processando..." : "Confirmar Pedido"}
                </button>
            </div>
          </div>

        </div>
      </div>

      {modalEnderecoOpen && (
          <div className="modal-overlay-address" onClick={() => setModalEnderecoOpen(false)}>
              <div className="modal-content-address" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                      <h3>Endereço de Entrega</h3>
                      <button onClick={() => setModalEnderecoOpen(false)}><FiX size={20}/></button>
                  </div>
                  <div className="alert-modal">
                      <FiAlertCircle />
                      <p>Para alterar seu endereço permanentemente, vá para o seu <span className="link-perfil" onClick={() => navigate('/perfil')}>Perfil</span>.</p>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}

export default FinalizarPedido;