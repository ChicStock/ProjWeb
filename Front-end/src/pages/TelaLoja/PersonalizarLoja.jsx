import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './PersonalizarLoja.css';
import { FiEdit2, FiCheck } from 'react-icons/fi';
import logoLojaPadrao from '../../assets/loja2.png';
import logosite from '../../assets/logo2teste.png';
// import axios from 'axios'; // (Para quando o back-end estiver pronto)

const dadosIniciaisDaLoja = {
  nome: 'Max Maize',
  descricao: 'Jeans de verdade, estilo sem limites.',
  endereco: {
    rua: 'Rua das Palmeiras, 1250',
    bairro: 'Jardim Central',
    cidadeEstado: 'Fortaleza - CE',
    cep: '60123-456'
  },
  entrega: 'A combinar',
  horario: {
    semana: 'Segunda à Sexta - 9h às 16h',
    sabado: 'Sábado - 10h às 14h',
    domingo: 'Domingo - Fechado'
  },
  contato: {
    telefone: '(85) 91234-5678',
    email: 'contato@maxmaize.com',
    instagram: '@lojamaxmaize'
  },
  pagamento: 'Cartão de Crédito e Pix'
};


const PersonalizarLoja = () => {
  const { id } = useParams();
  
  // 2. ESTADOS
  const [lojaData, setLojaData] = useState(dadosIniciaisDaLoja);
  const [editando, setEditando] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(logoLojaPadrao);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Quando o back-end funcionar, fará a chamada GET aqui
    // const fetchLojaData = async () => {
    //   const response = await axios.get(`http://localhost:8080/api/lojas/${id}`);
    //   setLojaData(response.data);
    //   setFotoPreview(response.data.urlLogo || logoLojaPadrao);
    // }
    // fetchLojaData();
    
    // Por enquanto, apenas logamos o ID que recebemos
    console.log("Personalizando a loja com ID (simulado):", id);
    
  }, [id]);


  const handleFieldChange = (field, value) => {
    setLojaData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (group, field, value) => {
    setLojaData(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Salvando todos os dados...', lojaData);
    // Quando o back-end funcionar:
    // try {
    //   await axios.put(`http://localhost:8080/api/lojas/${id}`, lojaData);
    //   alert('Loja atualizada com sucesso!');
    // } catch (error) {
    //   alert('Erro ao salvar. Tente novamente.');
    // }
    alert('Loja salva com sucesso! (Simulado)');
  };

  const handleFotoClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoPreview(URL.createObjectURL(file));
      // No futuro, enviará esse 'file' para o back-end
      // const formData = new FormData();
      // formData.append('imagemLogo', file);
      // axios.post(`/api/lojas/${id}/upload-logo`, formData);
    }
  };


  return (
    <div className="personalizacao-wrapper">
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFotoChange}
        style={{ display: 'none' }}
        accept="image/png, image/jpeg"
      />

      <div className="logo-externo">
        <img src={logosite} alt="Logo Site"/>
      </div>

      <form className="personalizacao-container" onSubmit={handleSubmit}>
        
        <div className="coluna-esquerda">
          <div className="perfil-foto-container">
            <img src={fotoPreview} alt="Logo da Loja" className="perfil-foto" />
            <a href="#" onClick={handleFotoClick} className="alterar-foto-link">
              Alterar Foto
            </a>
          </div>

          <div className="campo-container">
            <label>Endereço:</label>
            {editando === 'endereco' ? (
              <div className="campo-editavel-input multi-line-input">
                <input type="text" placeholder="Rua e Número" value={lojaData.endereco.rua} onChange={(e) => handleNestedChange('endereco', 'rua', e.target.value)} />
                <input type="text" placeholder="Bairro" value={lojaData.endereco.bairro} onChange={(e) => handleNestedChange('endereco', 'bairro', e.target.value)} />
                <input type="text" placeholder="Cidade - Estado" value={lojaData.endereco.cidadeEstado} onChange={(e) => handleNestedChange('endereco', 'cidadeEstado', e.target.value)} />
                <input type="text" placeholder="CEP" value={lojaData.endereco.cep} onChange={(e) => handleNestedChange('endereco', 'cep', e.target.value)} />
                <FiCheck className="save-icon" onClick={() => setEditando(null)} />
              </div>
            ) : (
              <div className="campo-editavel">
                <div className="multi-line">
                  <p>{lojaData.endereco.rua}</p>
                  <p>{lojaData.endereco.bairro}</p>
                  <p>{lojaData.endereco.cidadeEstado}</p>
                  <p>{lojaData.endereco.cep}</p>
                </div>
                <FiEdit2 className="edit-icon" onClick={() => setEditando('endereco')} />
              </div>
            )}
          </div>

          <div className="campo-container">
            <label>Entrega:</label>
            {editando === 'entrega' ? (
              <div className="campo-editavel-input">
                <input type="text" value={lojaData.entrega} onChange={(e) => handleFieldChange('entrega', e.target.value)} />
                <FiCheck className="save-icon" onClick={() => setEditando(null)} />
              </div>
            ) : (
              <div className="campo-editavel">
                <p>{lojaData.entrega}</p>
                <FiEdit2 className="edit-icon" onClick={() => setEditando('entrega')} />
              </div>
            )}
          </div>
        </div>

        <div className="coluna-direita">

          <div className="campo-container">
            <label>Nome:</label>
            {editando === 'nome' ? (
              <div className="campo-editavel-input">
                <input type="text" value={lojaData.nome} onChange={(e) => handleFieldChange('nome', e.target.value)} />
                <FiCheck className="save-icon" onClick={() => setEditando(null)} />
              </div>
            ) : (
              <div className="campo-editavel">
                <p>{lojaData.nome}</p>
                <FiEdit2 className="edit-icon" onClick={() => setEditando('nome')} />
              </div>
            )}
          </div>

          <div className="campo-container">
            <label>Descrição:</label>
            {editando === 'descricao' ? (
              <div className="campo-editavel-input">
                <textarea rows="3" value={lojaData.descricao} onChange={(e) => handleFieldChange('descricao', e.target.value)} />
                <FiCheck className="save-icon" onClick={() => setEditando(null)} />
              </div>
            ) : (
              <div className="campo-editavel">
                <p>{lojaData.descricao}</p>
                <FiEdit2 className="edit-icon" onClick={() => setEditando('descricao')} />
              </div>
            )}
          </div>

          <div className="campo-container">
            <label>Horário de Funcionamento:</label>
            {editando === 'horario' ? (
              <div className="campo-editavel-input multi-line-input">
                <input type="text" placeholder="Segunda à Sexta" value={lojaData.horario.semana} onChange={(e) => handleNestedChange('horario', 'semana', e.target.value)} />
                <input type="text" placeholder="Sábado" value={lojaData.horario.sabado} onChange={(e) => handleNestedChange('horario', 'sabado', e.target.value)} />
                <input type="text" placeholder="Domingo" value={lojaData.horario.domingo} onChange={(e) => handleNestedChange('horario', 'domingo', e.target.value)} />
                <FiCheck className="save-icon" onClick={() => setEditando(null)} />
              </div>
            ) : (
              <div className="campo-editavel">
                <div className="multi-line">
                  <p>{lojaData.horario.semana}</p>
                  <p>{lojaData.horario.sabado}</p>
                  <p>{lojaData.horario.domingo}</p>
                </div>
                <FiEdit2 className="edit-icon" onClick={() => setEditando('horario')} />
              </div>
            )}
          </div>

          <div className="campo-container">
            <label>Contato:</label>
            {editando === 'contato' ? (
              <div className="campo-editavel-input multi-line-input">
                <input type="tel" placeholder="Telefone/WhatsApp" value={lojaData.contato.telefone} onChange={(e) => handleNestedChange('contato', 'telefone', e.target.value)} />
                <input type="email" placeholder="E-mail" value={lojaData.contato.email} onChange={(e) => handleNestedChange('contato', 'email', e.target.value)} />
                <input type="text" placeholder="Instagram" value={lojaData.contato.instagram} onChange={(e) => handleNestedChange('contato', 'instagram', e.target.value)} />
                <FiCheck className="save-icon" onClick={() => setEditando(null)} />
              </div>
            ) : (
              <div className="campo-editavel">
                <div className="multi-line">
                  <p>{lojaData.contato.telefone}</p>
                  <p>{lojaData.contato.email}</p>
                  <p>{lojaData.contato.instagram}</p>
                </div>
                <FiEdit2 className="edit-icon" onClick={() => setEditando('contato')} />
              </div>
            )}
          </div>

          <div className="campo-container">
            <label>Formas de pagamento:</label>
            {editando === 'pagamento' ? (
              <div className="campo-editavel-input">
                <input type="text" value={lojaData.pagamento} onChange={(e) => handleFieldChange('pagamento', e.target.value)} />
                <FiCheck className="save-icon" onClick={() => setEditando(null)} />
              </div>
            ) : (
              <div className="campo-editavel">
                <p>{lojaData.pagamento}</p>
                <FiEdit2 className="edit-icon" onClick={() => setEditando('pagamento')} />
              </div>
            )}
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