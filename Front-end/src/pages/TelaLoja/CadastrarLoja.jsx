import React, { useState } from 'react';
import './CadastrarLoja.css';
import logosite from '../../assets/logo2teste.png';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Não precisamos do axios para simulação

const CadastrarLoja = () => {
  const navigate = useNavigate();
  
  const [nomeLoja, setNomeLoja] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Dados da nova loja:', { nomeLoja, descricao });
    alert('Loja criada com sucesso! Simulando navegação para a personalização...');

    navigate('/personalizarLoja/123-simulado'); 
    
    // --- CÓDIGO ORIGINAL (PARA QUANDO O BACK-END VOLTAR) ---
    /*
    try {
      const dataToSubmit = { nome: nomeLoja, descricao: descricao };
      
      const response = await axios.post('http://localhost:8080/api/lojas', dataToSubmit);
      
      const novaLojaId = response.data.id; 

      alert('Loja criada com sucesso! Agora vamos personalizar.');
      navigate(`/personalizar-loja/${novaLojaId}`); 

    } catch (error) {
       console.error('Erro ao criar loja:', error.response ? error.response.data : error.message);
       alert('Erro ao criar a loja. Tente novamente.');
    }
    */
    // --- FIM DO CÓDIGO ORIGINAL ---
  };

  return (
    <div className="cadastro-loja-wrapper">
 
      <form className="cadastro-loja-container" onSubmit={handleSubmit}>
        
        <div className="logo-interno-container">
          <img src={logosite} alt="Logo Site" className="logo-interno-img" />
        </div>

        <h2>Vamos criar sua loja!</h2>
        <p>Comece com o básico. Você poderá adicionar todos os detalhes de endereço, contato e horários depois.</p>

        <div className="campo-container">
          <label htmlFor="nomeLoja">Nome da Loja:</label>
          <input
            type="text"
            id="nomeLoja"
            className="input-field"
            value={nomeLoja}
            onChange={(e) => setNomeLoja(e.target.value)}
            placeholder="Ex: Max Maize"
            required
          />
        </div>

        <div className="campo-container">
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            className="input-field"
            rows="4"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Jeans de verdade, estilo sem limites."
            required
          />
        </div>

        <div className="rodape-acoes">
          <button type="submit" className="btn-salvar">
            Criar Loja e Personalizar
          </button>
        </div>

      </form>
    </div>
  );
};

export default CadastrarLoja;