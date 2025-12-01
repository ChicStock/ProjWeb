import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PersonalizarLoja.css';
import { FiEdit2, FiCheck, FiCamera, FiImage } from 'react-icons/fi'; 
import logosite from '../../assets/logo1.png';
import axios from 'axios'; 

const API_URL = "http://localhost:8080"; // URL do seu Backend

const PersonalizarLoja = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const opcoesEntrega = ["A combinar", "Retirada na Loja", "Entrega Própria (Motoboy)", "Correios/Transportadora"];
  const opcoesPagamento = ["Pix", "Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Boleto"];

  const [lojaData, setLojaData] = useState({
    nome: '',
    descricao: '',
    endereco: '',
    telefone: '',
    cnpj: '',
    entrega: '',    
    pagamento: ''   
  });

  const [editando, setEditando] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null); 
  const [fotoArquivo, setFotoArquivo] = useState(null); // Guarda o arquivo File real
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchLojaData = async () => {
      const token = localStorage.getItem('authToken');
      try {
          const response = await axios.get(`${API_URL}/api/v1/lojas/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const dados = response.data;
          
          setLojaData({
             nome: dados.nome || '',
             descricao: dados.descricao || '',
             endereco: dados.endereco || '',
             telefone: dados.telefone || '',
             cnpj: dados.cnpj || '',
             entrega: dados.entrega || opcoesEntrega[0], 
             pagamento: dados.pagamento || ''
          });

          if (dados.imgUrl) {
              setFotoPreview(`${API_URL}${dados.imgUrl}`);
          }
          
      } catch (error) {
          console.error("Erro ao buscar loja", error);
      }
    }
    if(id) fetchLojaData();
  }, [id]);


  const handleFieldChange = (field, value) => {
    setLojaData(prev => ({ ...prev, [field]: value }));
  };

  const togglePagamento = (opcao) => {
    let listaAtual = lojaData.pagamento ? lojaData.pagamento.split(', ') : [];
    
    if (listaAtual.includes(opcao)) {
        listaAtual = listaAtual.filter(item => item !== opcao);
    } else {
        listaAtual.push(opcao);
    }
    setLojaData(prev => ({ ...prev, pagamento: listaAtual.join(', ') }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    const formData = new FormData();

    formData.append("nome", lojaData.nome);
    formData.append("descricao", lojaData.descricao);
    formData.append("endereco", lojaData.endereco);
    formData.append("telefone", lojaData.telefone);
    formData.append("cnpj", lojaData.cnpj);
    formData.append("entrega", lojaData.entrega);
    formData.append("pagamento", lojaData.pagamento);

    if (fotoArquivo) {
        formData.append("imagem", fotoArquivo);
    }

    try {
      await axios.put(`${API_URL}/api/v1/lojas/${id}`, formData, {
         headers: { 
             Authorization: `Bearer ${token}`,
             "Content-Type": "multipart/form-data"
         }
      });
      
      alert('Loja atualizada com sucesso!');
      navigate('/RelatorioVendas');

    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar alterações.');
    }
  };

  const handleFotoClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoArquivo(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="personalizacao-wrapper">
       <input type="file" ref={fileInputRef} onChange={handleFotoChange} style={{ display: 'none' }} accept="image/png, image/jpeg" />

      <div className="logo-externo">
        <img src={logosite} alt="Logo Site"/>
      </div>

      <form className="personalizacao-container" onSubmit={handleSubmit}>
        
        <div className="coluna-esquerda">
          
          <div className="perfil-foto-container">
            {fotoPreview ? (
                <img src={fotoPreview} alt="Logo da Loja" className="perfil-foto" />
            ) : (
                <div className="perfil-foto-placeholder">
                    <FiImage size={40} color="rgba(255,255,255,0.3)" />
                </div>
            )}
            
            <div className="overlay-foto" onClick={handleFotoClick}>
                <FiCamera size={24} />
                <span>Alterar</span>
            </div>
          </div>

          <div className="campo-container">
            <label>Nome da Loja:</label>
            {editando === 'nome' ? (
              <div className="campo-editavel-input">
                <input type="text" value={lojaData.nome} onChange={(e) => handleFieldChange('nome', e.target.value)} />
                <FiCheck className="save-icon" onClick={() => setEditando(null)} />
              </div>
            ) : (
              <div className="campo-editavel">
                <p className="texto-destaque">{lojaData.nome}</p>
                <FiEdit2 className="edit-icon" onClick={() => setEditando('nome')} />
              </div>
            )}
          </div>

          <div className="campo-container">
            <label>CNPJ:</label>
            {editando === 'cnpj' ? (
              <div className="campo-editavel-input">
                <input 
                    type="text" 
                    value={lojaData.cnpj} 
                    onChange={(e) => handleFieldChange('cnpj', e.target.value)} 
                    placeholder="00.000.000/0000-00"
                />
                <FiCheck className="save-icon" onClick={() => setEditando(null)} />
              </div>
            ) : (
              <div className="campo-editavel">
                <p>{lojaData.cnpj || "Adicione o CNPJ"}</p>
                <FiEdit2 className="edit-icon" onClick={() => setEditando('cnpj')} />
              </div>
            )}
          </div>

          <div className="campo-container">
            <label>Descrição da Loja:</label>
            {editando === 'descricao' ? (
              <div className="campo-editavel-input">
                <textarea rows="4" value={lojaData.descricao} onChange={(e) => handleFieldChange('descricao', e.target.value)} />
                <FiCheck className="save-icon" onClick={() => setEditando(null)} />
              </div>
            ) : (
              <div className="campo-editavel">
                <p>{lojaData.descricao || "Adicione uma descrição..."}</p>
                <FiEdit2 className="edit-icon" onClick={() => setEditando('descricao')} />
              </div>
            )}
          </div>
        </div>

        <div className="coluna-direita">

          <div className="campo-container">
            <label>Telefone / WhatsApp:</label>
            {editando === 'telefone' ? (
              <div className="campo-editavel-input">
                <input type="tel" value={lojaData.telefone} onChange={(e) => handleFieldChange('telefone', e.target.value)} placeholder="(XX) 9XXXX-XXXX" />
                <FiCheck className="save-icon" onClick={() => setEditando(null)} />
              </div>
            ) : (
              <div className="campo-editavel">
                <p>{lojaData.telefone || "Sem telefone"}</p>
                <FiEdit2 className="edit-icon" onClick={() => setEditando('telefone')} />
              </div>
            )}
          </div>

          <div className="campo-container">
            <label>Endereço Completo:</label>
            {editando === 'endereco' ? (
              <div className="campo-editavel-input">
                <textarea rows="2" value={lojaData.endereco} onChange={(e) => handleFieldChange('endereco', e.target.value)} />
                <FiCheck className="save-icon" onClick={() => setEditando(null)} />
              </div>
            ) : (
              <div className="campo-editavel">
                <p>{lojaData.endereco || "Sem endereço"}</p>
                <FiEdit2 className="edit-icon" onClick={() => setEditando('endereco')} />
              </div>
            )}
          </div>

          <div className="campo-container">
             <label>Forma de Entrega:</label>
             <div className="campo-editavel select-wrapper">
                <select 
                    value={lojaData.entrega} 
                    onChange={(e) => handleFieldChange('entrega', e.target.value)}
                    className="select-estilizado"
                >
                    <option value="" disabled>Selecione uma opção</option>
                    {opcoesEntrega.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
             </div>
          </div>

          <div className="campo-container">
             <label>Formas de Pagamento Aceitas:</label>
             <div className="checkbox-grid">
                {opcoesPagamento.map((opcao) => {
                    const isChecked = lojaData.pagamento.includes(opcao);
                    return (
                        <label key={opcao} className={`checkbox-card ${isChecked ? 'checked' : ''}`}>
                            <input 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={() => togglePagamento(opcao)}
                            />
                            <span className="checkbox-label">{opcao}</span>
                        </label>
                    )
                })}
             </div>
          </div>

          <div className="rodape-acoes">
            <button type="submit" className="btn-salvar">Salvar Alterações</button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default PersonalizarLoja;