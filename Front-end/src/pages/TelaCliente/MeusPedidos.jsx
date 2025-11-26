import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./MeusPedidos.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiBox, FiTruck, FiCheckCircle, FiClock, FiShoppingBag, FiChevronRight, FiXCircle } from "react-icons/fi";

function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:8080/api/v1/pedidos/meus-pedidos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPedidos(response.data);
        } catch (err) {
            console.error("Erro ao buscar pedidos", err);
            setError("Não foi possível carregar seus pedidos.");
        } finally {
            setLoading(false);
        }
    };

    fetchPedidos();
  }, []);

  const getStatusStyle = (status) => {
      switch(status) {
          case 'ENTREGUE': return { class: 'status-green', icon: <FiCheckCircle />, label: 'Entregue' };
          case 'PAGO': return { class: 'status-blue', icon: <FiTruck />, label: 'A Caminho' };
          case 'PAGAMENTO_PENDENTE': return { class: 'status-yellow', icon: <FiClock />, label: 'Aguardando Pagamento' };
          case 'CARRINHO': return { class: 'status-yellow', icon: <FiShoppingBag />, label: 'Em Aberto' };
          default: return { class: 'status-yellow', icon: <FiClock />, label: status };
      }
  };
  const formatarData = (dataIso) => {
      if (!dataIso) return "";
      return new Date(dataIso).toLocaleDateString('pt-BR');
  };

  const formatarPreco = (valor) => {
      return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="pedidos-page-wrapper">
      <Navbar />
      
      <div className="pedidos-container">
        
        <div className="breadcrumb-pedidos">
            <Link to="/"><FiArrowLeft /> Voltar para Loja</Link>
        </div>

        <div className="pedidos-header-title">
            <h1>Meus Pedidos</h1>
            <p>Acompanhe o status das suas compras recentes.</p>
        </div>

        {loading && <div className="loading-msg">Carregando pedidos...</div>}
        
        {!loading && pedidos.length === 0 && (
            <div className="empty-pedidos">
                <FiShoppingBag size={50} color="#ccc"/>
                <p>Você ainda não fez nenhum pedido.</p>
                <Link to="/" className="btn-ir-compras">Ir às compras</Link>
            </div>
        )}

        <div className="pedidos-list">
            {pedidos.map((pedido) => {
                const statusInfo = getStatusStyle(pedido.pedidoStatus);
                
                return (
                    <div key={pedido.id} className="pedido-card">
                        <div className="pedido-card-header">
                            <div className="pedido-meta">
                                <span className="pedido-data">{formatarData(pedido.data)}</span>
                                <span className="pedido-id">#{pedido.id}</span>
                            </div>
                            <div className={`pedido-status ${statusInfo.class}`}>
                                {statusInfo.icon} {statusInfo.label}
                            </div>
                        </div>

                        <div className="pedido-body">
                            <div className="pedido-loja-info">
                                <FiShoppingBag /> {pedido.nomeLoja || "Loja Parceira"}
                            </div>

                            <div className="pedido-itens-grid">
                                {pedido.itens && pedido.itens.map((item, idx) => (
                                    <div key={idx} className="item-row">
                                        <div className="item-thumb">
                                            {item.imgUrl && !item.imgUrl.includes('placeholder') ? 
                                                <img src={item.imgUrl} alt={item.nome} /> : 
                                                <FiBox />
                                            }
                                        </div>
                                        <div className="item-details">
                                            <h4>{item.nome}</h4>
                                            <p>
                                                <strong>{formatarPreco(item.preco)}</strong>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pedido-footer">
                            <div className="pedido-total">
                                <span>Total do Pedido:</span>
                                <strong>{formatarPreco(pedido.valorTotal)}</strong>
                            </div>
                            <button className="btn-detalhes">
                                Ver Detalhes <FiChevronRight />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>

      </div>
    </div>
  );
}

export default MeusPedidos;