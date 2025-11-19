import React, { useState, useRef, useEffect } from "react";
import "./CadastroProduto.css"; // Importação direta do CSS
import logosite from "../../assets/logo2teste.png";
import { FiUploadCloud, FiCamera, FiArrowLeft, FiMinus, FiPlus, FiCheck } from "react-icons/fi"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cadastroproduto() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [lojaId, setLojaId] = useState(null);

  // Moldes de tamanho
  const moldes = {
    letras: ["PP", "P", "M", "G", "GG", "XG"],
    numeros: ["34", "36", "38", "40", "42", "44", "46", "48"],
    unico: ["Único"]
  };

  const [tipoTamanho, setTipoTamanho] = useState(""); 
  const [estoqueDetalhado, setEstoqueDetalhado] = useState({}); 

  const [produto, setProduto] = useState({
    nome: "",
    categoriaId: "",
    descricao: "",
    valor: "",
    imgUrl: "",
    foto: null,
    preview: null 
  });

  // Busca Loja ID ao carregar
  useEffect(() => {
      const fetchLoja = async () => {
          const token = localStorage.getItem('authToken');
          if(!token) return;
          try {
              const response = await axios.get('http://localhost:8080/api/v1/dashboard/resumo', {
                  headers: { Authorization: `Bearer ${token}` }
              });
              if(response.data && response.data.idLoja) {
                  setLojaId(response.data.idLoja);
              }
          } catch (error) { console.error(error); }
      };
      fetchLoja();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduto({ ...produto, foto: file, preview: URL.createObjectURL(file) });
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  // --- LÓGICA DE ESTOQUE ---
  const selecionarMolde = (tipo) => {
      setTipoTamanho(tipo);
      const novoEstoque = {};
      moldes[tipo].forEach(tam => novoEstoque[tam] = 0);
      setEstoqueDetalhado(novoEstoque);
  };

  const alterarQtd = (tamanho, delta) => {
      setEstoqueDetalhado(prev => {
          const novaQtd = (prev[tamanho] || 0) + delta;
          if (novaQtd < 0) return prev;
          return { ...prev, [tamanho]: novaQtd };
      });
  };

  const calcularEstoqueTotal = () => {
      return Object.values(estoqueDetalhado).reduce((acc, curr) => acc + curr, 0);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { alert("Logue novamente."); return; }
    if (!lojaId) { alert("Loja não identificada."); return; }

    const estoqueTotal = calcularEstoqueTotal();

    if (!produto.nome || !produto.valor || !produto.categoriaId) {
        alert("Preencha Nome, Categoria e Valor.");
        return;
    }

    if (estoqueTotal === 0) {
        alert("Adicione pelo menos 1 item ao estoque.");
        return;
    }

    const valorFormatado = produto.valor.toString().replace(',', '.');
    
    // Salva o detalhe na descrição (gambiarra temporária funcional)
    const descricaoComEstoque = `${produto.descricao}\n\n[Estoque]: ${JSON.stringify(estoqueDetalhado)}`;

    const payload = {
        nome: produto.nome,
        descricao: descricaoComEstoque,
        preco: parseFloat(valorFormatado),
        quantidade: estoqueTotal, 
        imgUrl: "http://placeholder.com/img",
        categoriaId: parseInt(produto.categoriaId),
        lojaId: lojaId
    };

    try {
        await axios.post('http://localhost:8080/api/v1/produtos', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Produto cadastrado com sucesso!");
        navigate('/RelatorioVendas'); 
    } catch (error) {
        console.error(error);
        alert("Erro ao cadastrar.");
    }
  };

  return (
    <div className="cadastro-produto-wrapper">
      <button className="btn-voltar" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Voltar
      </button>

      <div className="logo-externo">
        <img src={logosite} alt="Chic Stock" />
      </div>

      <div className="container">
        
        <div className="form-section">
          <h2 className="titulo">Cadastrar Produto</h2>
          <p className="subtitulo">Defina os detalhes e o estoque por tamanho</p>
          
          <form className="form">
            
            <div className="input-group">
                <label>Nome do Produto</label>
                <input className="input-visual" placeholder="Ex: Calça Jeans Slim"
                value={produto.nome} onChange={(e) => setProduto({ ...produto, nome: e.target.value })} />
            </div>

            <div className="row">
                <div className="input-group">
                    <label>Categoria</label>
                    <div className="select-wrapper">
                        <select className="select-visual"
                        value={produto.categoriaId} onChange={(e) => setProduto({ ...produto, categoriaId: e.target.value })}>
                            <option value="" disabled>Selecione...</option>
                            <option value="1">Blusa</option>
                            <option value="2">Calça</option>
                            <option value="3">Vestido</option>
                            <option value="4">Saia</option>
                            <option value="5">Short</option>
                            <option value="6">Moda Praia</option>
                            <option value="7">Beleza</option>
                            <option value="8">Jaqueta</option>
                            <option value="9">Infantil</option>
                        </select>
                    </div>
                </div>
                <div className="input-group">
                    <label>Valor (R$)</label>
                    <input className="input-visual" placeholder="0,00"
                    value={produto.valor} onChange={(e) => setProduto({ ...produto, valor: e.target.value })} />
                </div>
            </div>

            {/* SEÇÃO DE TAMANHOS */}
            <div className="secao-tamanhos">
                <label>Formato de Tamanho:</label>
                <div className="lista-formatos">
                    <div 
                        className={`item-formato ${tipoTamanho === 'letras' ? 'ativo' : ''}`}
                        onClick={() => selecionarMolde('letras')}
                    >
                        <span>P / M / G</span>
                        {tipoTamanho === 'letras' && <FiCheck />}
                    </div>
                    <div 
                        className={`item-formato ${tipoTamanho === 'numeros' ? 'ativo' : ''}`}
                        onClick={() => selecionarMolde('numeros')}
                    >
                        <span>36 / 38 / 40</span>
                        {tipoTamanho === 'numeros' && <FiCheck />}
                    </div>
                    <div 
                        className={`item-formato ${tipoTamanho === 'unico' ? 'ativo' : ''}`}
                        onClick={() => selecionarMolde('unico')}
                    >
                        <span>Tamanho Único</span>
                        {tipoTamanho === 'unico' && <FiCheck />}
                    </div>
                </div>
            </div>

            {/* GRID DE ESTOQUE */}
            {tipoTamanho && (
                <div className="secao-estoque">
                    <div className="header-estoque">
                        <span>Tam</span>
                        <span>Qtd Disponível</span>
                    </div>
                    <div className="lista-estoque">
                        {moldes[tipoTamanho].map(tam => (
                            <div key={tam} className="linha-estoque">
                                <span className="label-tam">{tam}</span>
                                <span className="valor-qtd">{estoqueDetalhado[tam]}</span>
                                <div className="controles">
                                    <button type="button" onClick={() => alterarQtd(tam, 1)}><FiPlus /></button>
                                    <button type="button" onClick={() => alterarQtd(tam, -1)}><FiMinus /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="total-estoque">
                        Total: {calcularEstoqueTotal()} itens
                    </div>
                </div>
            )}

            <div className="input-group">
                <label>Descrição Adicional</label>
                <textarea className="input-visual textarea"
                placeholder="Detalhes do produto..."
                value={produto.descricao} onChange={(e) => setProduto({ ...produto, descricao: e.target.value })} />
            </div>

            <button className="btn-cadastrar" type="button" onClick={handleSubmit}>
              Salvar Produto
            </button>
          </form>
        </div>

        {/* COLUNA DIREITA */}
        <div className="imagem-section">
          <div className="imagem-card" onClick={triggerFileInput}>
            <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleImageChange} />
            {produto.preview ? (
                <img src={produto.preview} alt="Preview" className="imagem-preview" />
            ) : (
                <div className="placeholder-upload">
                    <FiUploadCloud size={50} />
                    <span>Clique para enviar foto</span>
                </div>
            )}
            <div className="overlay-hover"><FiCamera size={24} /> Alterar</div>
          </div>
          <span className="imagem-legenda">Formatos: JPG, PNG</span>
        </div>

      </div>
    </div>
  );
}

export default Cadastroproduto;