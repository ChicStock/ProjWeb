import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './RelatorioVendas.css';
import axios from 'axios'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FiDollarSign, FiShoppingBag, FiClock, FiCalendar, FiPlus, FiSettings, FiArrowLeft, FiLoader, FiChevronDown, FiUser, FiLogOut, FiHome, FiBox, FiEdit3, FiSave, FiX, FiMinus, FiTrash2, FiEye, FiCheck } from 'react-icons/fi'; 

const API_URL = "http://localhost:8080";

const STATUS_OPCOES = [
    { value: "PAGAMENTO_PENDENTE", label: "Aguardando Pagamento" },
    { value: "PAGO", label: "Pago / A Caminho" },
    { value: "ENTREGUE", label: "Entregue" }
];

const RelatorioVendas = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [menuAberto, setMenuAberto] = useState(false);

  const [produtoExpandido, setProdutoExpandido] = useState(null);
  const [estoqueTemp, setEstoqueTemp] = useState({}); 
  const [precoTemp, setPrecoTemp] = useState(""); 

  const [statusEditando, setStatusEditando] = useState(null);
  const [novoStatus, setNovoStatus] = useState(""); 

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { navigate('/login'); return; }
    try {
        const response = await axios.get(`${API_URL}/api/v1/dashboard/resumo`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(response.data);
        setLoading(false);
    } catch (error) {
        console.error("Erro:", error);
        setErro("Erro ao carregar dados.");
        setLoading(false);
    }
  };

  const parseEstoqueDescricao = (descricao) => {
      if (!descricao) return null;
      const match = descricao.match(/\[Estoque\]: (\{.*\})/);
      if (match && match[1]) {
          try { return JSON.parse(match[1]); } catch (e) { return null; }
      }
      return null;
  };

  const abrirEditorEstoque = (produto) => {
      const estoqueSalvo = parseEstoqueDescricao(produto.descricao) || { "Padrão": produto.quantidade };
      setEstoqueTemp(estoqueSalvo);
      setPrecoTemp(produto.valor); 
      setProdutoExpandido(produto.id);
  };

  const alterarQtdTemp = (tamanho, delta) => {
      setEstoqueTemp(prev => {
          const novaQtd = (prev[tamanho] || 0) + delta;
          if (novaQtd < 0) return prev;
          return { ...prev, [tamanho]: novaQtd };
      });
  };

  const excluirProduto = async (idProduto) => {
      const confirmacao = window.confirm("Tem certeza que deseja excluir este produto?");
      if (!confirmacao) return;
      const token = localStorage.getItem('authToken');
      try {
          await axios.delete(`${API_URL}/api/v1/produtos/${idProduto}?confirm=true`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          const novoDashboard = { ...dashboardData };
          novoDashboard.estoque = novoDashboard.estoque.filter(p => p.id !== idProduto);
          setDashboardData(novoDashboard);
          alert("Produto excluído.");
      } catch (error) {
          alert("Erro ao excluir produto.");
      }
  };

  const salvarAlteracoes = async (produtoOriginal) => {
      const novaQtdTotal = Object.values(estoqueTemp).reduce((a, b) => a + b, 0);
      let descBase = produtoOriginal.descricao ? produtoOriginal.descricao.split('[Estoque]:')[0].trim() : "";
      const novaDescricao = `${descBase}\n\n[Estoque]: ${JSON.stringify(estoqueTemp)}`;
      const novoPreco = parseFloat(precoTemp.toString().replace(',', '.'));

      const payload = {
          nome: produtoOriginal.nome,
          preco: novoPreco, 
          quantidade: novaQtdTotal,
          descricao: novaDescricao,
          lojaId: dashboardData.idLoja
      };

      try {
          const token = localStorage.getItem('authToken');
          await axios.patch(`${API_URL}/api/v1/produtos/${produtoOriginal.id}`, payload, {
              headers: { Authorization: `Bearer ${token}` }
          });

          const novoDashboard = { ...dashboardData };
          const prodIndex = novoDashboard.estoque.findIndex(p => p.id === produtoOriginal.id);
          if (prodIndex >= 0) {
              novoDashboard.estoque[prodIndex].quantidade = novaQtdTotal;
              novoDashboard.estoque[prodIndex].descricao = novaDescricao;
              novoDashboard.estoque[prodIndex].valor = novoPreco; 
          }
          setDashboardData(novoDashboard);
          setProdutoExpandido(null);
          alert("Alterações salvas!");
      } catch (error) {
          alert("Erro ao atualizar.");
      }
  };

  const iniciarEdicaoStatus = (pedido) => {
      setStatusEditando(pedido.id);
      setNovoStatus(pedido.pedidoStatus);
  };

const salvarStatusPedido = async (pedidoId) => {
      const token = localStorage.getItem('authToken');
      try {
          const payload = {
              pedidoStatus: novoStatus
          };

          await axios.put(`${API_URL}/api/v1/pedidos/${pedidoId}`, payload, {
              headers: { Authorization: `Bearer ${token}` }
          });

          await carregarDados(); 
          
          setStatusEditando(null);

      } catch (error) {
          console.error("Erro ao mudar status", error);
          alert("Erro ao atualizar status.");
      }
  };

  const irParaCadastroProduto = () => navigate('/cadastroProduto');
  const irParaHome = () => navigate('/Telainicial');
  const irParaEditarLoja = () => navigate(`/personalizarLoja/${dashboardData?.idLoja || 1}`);
  const irParaVerLoja = () => navigate(`/loja/${dashboardData?.idLoja}`);
  
  const fazerLogout = () => { localStorage.removeItem('authToken'); navigate('/login'); };
  
  const formatarStatusTexto = (s) => {
      const opcao = STATUS_OPCOES.find(opt => opt.value === s);
      return opcao ? opcao.label : s;
  };

  if (loading) return <div className="relatorio-wrapper loading-screen"><FiLoader className="icon-spin" size={40} /><p>Carregando painel...</p></div>;
  if (erro) return <div className="relatorio-wrapper error-screen"><p>{erro}</p><button onClick={irParaHome} className="btn-acao secundario">Voltar para Início</button></div>;

  return (
    <div className="relatorio-wrapper">
      
      <header className="dashboard-header">
        <div className="header-content">
            <div className="header-left"></div>
            <div className="header-actions">
                <button className="btn-acao primario" onClick={irParaCadastroProduto}>
                    <FiPlus /> Adicionar Produto
                </button>
                <button className="btn-acao secundario" onClick={irParaEditarLoja}>
                    <FiSettings /> Editar Loja
                </button>
            </div>
            <div className="perfil-container" onClick={() => setMenuAberto(!menuAberto)}>
                <div className="perfil-info">
                    <span className="bem-vindo">Bem vindo:</span>
                    <span className="nome-loja">{dashboardData.nomeLoja || "Minha Loja"}</span>
                </div>
                <div className="avatar-circle">{dashboardData.nomeLoja ? dashboardData.nomeLoja.charAt(0).toUpperCase() : "L"}</div>
                <FiChevronDown className={`seta-menu ${menuAberto ? 'aberta' : ''}`} />
                {menuAberto && (
                    <div className="dropdown-menu">
                        {/* --- CORREÇÃO AQUI: Link para a loja pública --- */}
                        <button onClick={irParaVerLoja}><FiEye /> Ver Minha Loja</button>
                        {/* ----------------------------------------------- */}
                        <button onClick={irParaHome}><FiHome /> Voltar Início</button>
                        <div className="divisor"></div>
                        <button onClick={fazerLogout} className="logout"><FiLogOut /> Sair</button>
                    </div>
                )}
            </div>
        </div>
      </header>

      <main className="dashboard-content">

        <div className="kpi-grid">
            <div className="kpi-card total">
                <div className="kpi-icon"><FiDollarSign /></div>
                <div className="kpi-info"><span>Faturamento Total</span><h3>{dashboardData.faturamentoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3></div>
            </div>
            <div className="kpi-card pagos">
                <div className="kpi-icon"><FiShoppingBag /></div>
                <div className="kpi-info"><span>Pedidos Pagos e Entregues</span><h3>{dashboardData.pedidosPagos}</h3></div>
            </div>
            <div className="kpi-card pendentes">
                <div className="kpi-icon"><FiClock /></div>
                <div className="kpi-info">
                    <span>Em Aberto</span>
                    <h3>{dashboardData.pedidosPendentes}</h3>
                </div>
            </div>
        </div>

        <div className="dashboard-grid">

            <section className="estoque-card">
                <div className="card-header">
                    <h2>Controle de Produtos</h2>
                    <div className="periodo-badge"><FiBox /> {dashboardData.estoque ? dashboardData.estoque.length : 0} Itens</div>
                </div>
                <div className="tabela-scroll">
                    <table className="tabela-estoque">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Valor</th>
                                <th style={{textAlign: 'center'}}>Qtd</th>
                                <th style={{textAlign: 'right'}}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.estoque && dashboardData.estoque.map((prod) => (
                                <React.Fragment key={prod.id}>
                                    <tr className={produtoExpandido === prod.id ? "linha-ativa" : ""}>
                                        <td>
                                            <div className="produto-info">
                                                <strong>{prod.nome}</strong>
                                                <small>{prod.categoria}</small>
                                            </div>
                                        </td>
                                        <td>{prod.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td style={{textAlign: 'center', fontWeight: 'bold'}}>
                                            {prod.quantidade}
                                        </td>
                                        <td style={{textAlign: 'right'}}>
                                            {produtoExpandido === prod.id ? (
                                                <button className="btn-icon-action cancelar" onClick={() => setProdutoExpandido(null)} title="Cancelar">
                                                    <FiX />
                                                </button>
                                            ) : (
                                                <div className="acoes-grupo">
                                                    <button className="btn-icon-action editar" onClick={() => abrirEditorEstoque(prod)} title="Editar">
                                                        <FiEdit3 />
                                                    </button>
                                                    <button className="btn-icon-action excluir" onClick={() => excluirProduto(prod.id)} title="Excluir">
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                    {produtoExpandido === prod.id && (
                                        <tr className="linha-detalhe">
                                            <td colSpan="4">
                                                <div className="painel-tamanhos">
                                                    <div className="editor-preco">
                                                        <label>Preço Unitário (R$):</label>
                                                        <input 
                                                            type="number" 
                                                            value={precoTemp} 
                                                            onChange={(e) => setPrecoTemp(e.target.value)}
                                                            className="input-preco-painel"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    <div className="divisor-painel"></div>
                                                    <label className="label-painel">Controle de Tamanhos:</label>
                                                    <div className="grid-tamanhos">
                                                        {Object.entries(estoqueTemp).map(([tam, qtd]) => (
                                                            <div key={tam} className="item-tamanho-controle">
                                                                <span className="tam-label">{tam}</span>
                                                                <div className="qtd-controle">
                                                                    <button onClick={() => alterarQtdTemp(tam, -1)}><FiMinus size={12}/></button>
                                                                    <span>{qtd}</span>
                                                                    <button onClick={() => alterarQtdTemp(tam, 1)}><FiPlus size={12}/></button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="painel-footer">
                                                        <span className="total-temp">Novo Total: <strong>{Object.values(estoqueTemp).reduce((a,b)=>a+b,0)}</strong></span>
                                                        <button className="btn-salvar-estoque" onClick={() => salvarAlteracoes(prod)}>
                                                            <FiSave /> Salvar Tudo
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="coluna-grafico-tabela">
                <section className="grafico-card">
                    <div className="card-header">
                        <h2>Mais Vendidos</h2>
                        <div className="periodo-badge"><FiCalendar /> Geral</div>
                    </div>
                    <div className="grafico-container">
                        {dashboardData.grafico.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboardData.grafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="nome" axisLine={false} tickLine={false} tick={false} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                    <Tooltip cursor={{fill: '#f5f5f5'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                    <Bar dataKey="vendas" radius={[4, 4, 0, 0]}>
                                        {dashboardData.grafico.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill="#9b9490" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="sem-dados">Nenhuma venda registrada.</div>
                        )}
                    </div>
                </section>

                <section className="tabela-card">
                    <div className="card-header">
                        <h2>Últimos Pedidos</h2>
                    </div>
                    <div className="tabela-scroll">
                        <table className="tabela-pedidos">
                            <thead>
                                <tr>
                                    <th>Pedido</th>
                                    <th>Cliente</th>
                                    <th>Itens</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.ultimosPedidos.length > 0 ? (
                                    dashboardData.ultimosPedidos.map((pedido, index) => (
                                        <tr key={index}>
                                            <td className="col-id">#{pedido.id}</td>
                                            <td>
                                                <div className="cliente-info">
                                                    <strong>{pedido.nomeCliente || "Cliente"}</strong>
                                                    <small>{pedido.data ? new Date(pedido.data).toLocaleDateString('pt-BR') : "-"}</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="itens-lista">
                                                    <span title={pedido.resumoItens}>{pedido.resumoItens}</span>
                                                </div>
                                            </td>
                                            <td className="col-valor">
                                                {pedido.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>

                                            <td>
                                                {statusEditando === pedido.id ? (
                                                    <select 
                                                        className="select-status-inline"
                                                        value={novoStatus}
                                                        onChange={(e) => setNovoStatus(e.target.value)}
                                                    >
                                                        {STATUS_OPCOES.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className={`status-badge ${pedido.pedidoStatus ? pedido.pedidoStatus.toLowerCase() : ''}`}>
                                                        {formatarStatusTexto(pedido.pedidoStatus)}
                                                    </span>
                                                )}
                                            </td>

                                            <td style={{textAlign: 'center'}}>
                                                {statusEditando === pedido.id ? (
                                                    <div className="acoes-status">
                                                        <button className="btn-check-status" onClick={() => salvarStatusPedido(pedido.id)}><FiCheck /></button>
                                                        <button className="btn-cancel-status" onClick={() => setStatusEditando(null)}><FiX /></button>
                                                    </div>
                                                ) : (
                                                    <button className="btn-edit-status" onClick={() => iniciarEdicaoStatus(pedido)} title="Alterar Status">
                                                        <FiEdit3 />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{textAlign: 'center', padding: '30px', color: '#999'}}>
                                            Nenhum pedido recente.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
      </main>
    </div>
  );
};

export default RelatorioVendas;