import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"; 
import "./TelaLoja.css";
import { useCart } from "./Carrinho";
import LojaDefault from "../../assets/loja2.png"; 
import { FiMapPin, FiPhone, FiInstagram, FiClock, FiCreditCard, FiShoppingBag, FiArrowLeft, FiTag, FiX, FiMinus, FiPlus } from "react-icons/fi";

const CATEGORIAS = {
    1: "Blusa", 2: "Calça", 3: "Vestido", 4: "Saia", 
    5: "Short", 6: "Moda Praia", 7: "Beleza", 8: "Jaqueta", 9: "Infantil"
};

function TelaLoja() {
  const { id } = useParams(); 
  const { addToCart } = useCart();

  const [loja, setLoja] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [estoqueDisponivel, setEstoqueDisponivel] = useState({}); 

  const limparDescricao = (descricaoCompleta) => {
      if (!descricaoCompleta) return "";
      return descricaoCompleta.split('[Estoque]:')[0].trim();
  };

  const extrairEstoque = (descricaoCompleta) => {
      try {
          if (!descricaoCompleta || !descricaoCompleta.includes('[Estoque]:')) return {};
          const jsonPart = descricaoCompleta.split('[Estoque]:')[1].trim();
          return JSON.parse(jsonPart);
      } catch (e) {
          return {};
      }
  };

  const abrirModal = (produto) => {
      const estoqueObj = extrairEstoque(produto.descricao);
      setProdutoSelecionado(produto);
      setEstoqueDisponivel(estoqueObj);
      setTamanhoSelecionado("");
      setQuantidade(1);
  };

  const fecharModal = () => {
      setProdutoSelecionado(null);
  };

  const mudarQuantidade = (delta) => {
      setQuantidade(prev => {
          const novo = prev + delta;
          if (novo < 1) return 1;
          if (tamanhoSelecionado && estoqueDisponivel[tamanhoSelecionado]) {
             if (novo > estoqueDisponivel[tamanhoSelecionado]) return prev;
          }
          return novo;
      });
  };

  const adicionarAoCarrinho = () => {
      if (!tamanhoSelecionado && Object.keys(estoqueDisponivel).length > 0) {
          alert("Por favor, selecione um tamanho.");
          return;
      }
      
      const tamanhoFinal = tamanhoSelecionado || "Único";
      addToCart(produtoSelecionado, tamanhoFinal, quantidade, loja.nome, loja.id);
      
      fecharModal();

  };

  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/v1/lojas/${id}`);
        setLoja(response.data);

        try {
            const prodResponse = await axios.get(`http://localhost:8080/api/v1/produtos/loja/${id}`);
            setProdutos(prodResponse.data || []); 
        } catch (prodError) {
            setProdutos([]); 
        }

      } catch (err) {
        setError("Não foi possível carregar os dados desta loja.");
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, [id]);

  if (loading) return <div className="loading-screen"><Navbar/><div className="spinner"></div><p>Carregando loja...</p></div>;
  if (error || !loja) return <div className="error-screen"><Navbar/><FiShoppingBag size={50}/><p>{error || "Loja não encontrada."}</p><Link to="/" className="btn-voltar-erro">Voltar ao Início</Link></div>;

  return (
    <div className="loja-page-wrapper">
      <Navbar />

      <div className="loja-container">
        <div className="breadcrumb">
            <Link to="/"><FiArrowLeft /> Voltar para Vitrine</Link>
        </div>

        <header className="loja-header-card">
          <div className="loja-image-box">
            <img src={LojaDefault} alt={loja.nome} className="loja-main-img" />
          </div>
          <div className="loja-info-box">
            <div className="loja-title-area">
                <h1 className="loja-title">{loja.nome}</h1>
                <span className={`status-badge ${loja.statusLoja === 'ATIVO' ? 'ativo' : 'inativo'}`}>
                    {loja.statusLoja || 'Aberta'}
                </span>
            </div>
            <p className="loja-descricao">{loja.descricao || "Bem-vindo à nossa loja virtual!"}</p>
            <div className="loja-quick-contacts">
                {loja.telefone && <span><FiPhone /> {loja.telefone}</span>}
                <span><FiInstagram /> @{loja.nome.replace(/\s+/g, '').toLowerCase()}</span>
            </div>
          </div>
        </header>

        <section className="loja-detalhes-grid">
          <div className="detalhe-card">
            <div className="card-icon-box"><FiMapPin /></div>
            <div className="card-text-box">
                <h3>Localização</h3>
                <p>{loja.endereco || "Endereço não cadastrado."}</p>
            </div>
          </div>
          <div className="detalhe-card">
            <div className="card-icon-box"><FiCreditCard /></div>
            <div className="card-text-box">
                <h3>Pagamento & Envio</h3>
                <p><strong>Aceitamos:</strong> {loja.pagamento || "Pix, Dinheiro e Cartão"}</p>
                <p><strong>Envio:</strong> {loja.entrega || "A combinar / Correios"}</p>
            </div>
          </div>
          <div className="detalhe-card">
            <div className="card-icon-box"><FiClock /></div>
            <div className="card-text-box">
                <h3>Funcionamento</h3>
                <p>Segunda a Sexta: 09h às 18h</p>
                <p>Sábado: 09h às 13h</p>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        <section className="loja-catalogo-section">
          <h2 className="section-title">
            <FiShoppingBag className="title-icon"/> Produtos Disponíveis
          </h2>

          {produtos.length > 0 ? (
            <div className="produtos-grid">
                {produtos.map((prod) => (
                <div key={prod.id} className="produto-card">
                    <div className="produto-img-placeholder">
                        {prod.imgUrl && !prod.imgUrl.includes("placeholder") ? (
                            <img src={prod.imgUrl} alt={prod.nome} />
                        ) : (
                            <FiShoppingBag size={35} color="#ccc"/>
                        )}
                        {prod.categoriaId && CATEGORIAS[prod.categoriaId] && (
                            <span className="categoria-tag">{CATEGORIAS[prod.categoriaId]}</span>
                        )}
                    </div>

                    <div className="produto-card-body">
                        <div className="produto-header">
                            <h3 className="produto-title">{prod.nome}</h3>
                            <span className="produto-ref">#{prod.id}</span>
                        </div>
                        <p className="produto-desc-curta">
                            {limparDescricao(prod.descricao).substring(0, 50)}...
                        </p>
                        <div className="produto-footer">
                            <span className="produto-price">
                                {Number(prod.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                            <button className="btn-comprar" onClick={() => abrirModal(prod)}>
                                Ver Detalhes
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
          ) : (
              <div className="empty-catalogo">
                  <div className="empty-icon"><FiTag /></div>
                  <h3>Nenhum produto encontrado</h3>
              </div>
          )}
        </section>
      </div>

      {produtoSelecionado && (
          <div className="modal-produto-overlay" onClick={fecharModal}>
              <div className="modal-produto-content" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-close-modal" onClick={fecharModal}><FiX /></button>

                  <div className="modal-produto-body">
                      <div className="modal-img-area">
                        {produtoSelecionado.imgUrl && !produtoSelecionado.imgUrl.includes("placeholder") ? (
                            <img src={produtoSelecionado.imgUrl} alt={produtoSelecionado.nome} />
                        ) : (
                            <div className="modal-placeholder-icon">
                                <FiShoppingBag size={60} color="#ddd"/>
                            </div>
                        )}
                      </div>

                      <div className="modal-info-area">
                          <h2 className="modal-prod-title">{produtoSelecionado.nome}</h2>
                          <p className="modal-prod-ref">Ref: {produtoSelecionado.id}</p>
                          <p className="modal-prod-desc">
                              {limparDescricao(produtoSelecionado.descricao)}
                          </p>

                          <div className="modal-prod-price">
                              {Number(produtoSelecionado.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>

                          <div className="modal-divider"></div>

                          <div className="modal-section-title">Escolha o Tamanho:</div>
                          <div className="tamanhos-grid">
                              {Object.keys(estoqueDisponivel).map((tam) => {
                                  const qtd = estoqueDisponivel[tam];
                                  const semEstoque = qtd <= 0;
                                  return (
                                      <button 
                                          key={tam}
                                          className={`btn-tamanho ${tamanhoSelecionado === tam ? 'selecionado' : ''} ${semEstoque ? 'indisponivel' : ''}`}
                                          onClick={() => !semEstoque && setTamanhoSelecionado(tam)}
                                          disabled={semEstoque}
                                      >
                                          {tam}
                                      </button>
                                  )
                              })}
                              {Object.keys(estoqueDisponivel).length === 0 && <p className="aviso-sem-tam">Tamanho Único</p>}
                          </div>

                          <div className="modal-actions-row">
                              <div className="qtd-selector">
                                  <button onClick={() => mudarQuantidade(-1)} disabled={quantidade <= 1}><FiMinus /></button>
                                  <span>{quantidade}</span>
                                  <button onClick={() => mudarQuantidade(1)}><FiPlus /></button>
                              </div>

                              <button 
                                  className="btn-add-carrinho" 
                                  onClick={adicionarAoCarrinho}
                                  disabled={!tamanhoSelecionado && Object.keys(estoqueDisponivel).length > 0}
                              >
                                  Adicionar à Sacola
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

export default TelaLoja;