import React, { useState } from 'react';
import './CadastrarLoja.css'; // O CSS que criámos
import logosite from '../../assets/logo2teste.png'; // O logo
import { useNavigate } from 'react-router-dom'; // Importar o navigate
// import axios from 'axios'; // Não precisamos do axios para simulação

const CadastrarLoja = () => {
  const navigate = useNavigate();
  
  // 1. Estado para os campos
  const [nomeLoja, setNomeLoja] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- MODO DE TESTE DE NAVEGAÇÃO (BACK-END DESLIGADO) ---
    console.log('Dados da nova loja:', { nomeLoja, descricao });
    alert('Loja criada com sucesso! Simulando navegação para a personalização...');

    // 3. Após o sucesso, navegar para a página de personalizar
    // Como não temos back-end, vamos usar um ID falso/simulado
    // Lembre-se de ter uma rota como /personalizar-loja/:id no seu App.js
    navigate('/personalizarLoja/123-simulado'); 
    
    // --- CÓDIGO ORIGINAL (PARA QUANDO O BACK-END VOLTAR) ---
    /*
    try {
      // O seu DTO pode esperar 'nome' e não 'nomeLoja', ajuste se necessário
      const dataToSubmit = { nome: nomeLoja, descricao: descricao };
      
      // ATENÇÃO: A URL aqui é um exemplo, ajuste para o seu back-end
      const response = await axios.post('http://localhost:8080/api/lojas', dataToSubmit);
      
      // O back-end deve retornar a loja criada, incluindo o ID
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
      
      {/* Container principal, agora como um formulário */}
      <form className="cadastro-loja-container" onSubmit={handleSubmit}>
        
        {/* --- LOGO MOVIDO PARA CÁ --- */}
        {/* Agora o logo está dentro do container do formulário */}
        <div className="logo-interno-container">
          <img src={logosite} alt="Logo Site" className="logo-interno-img" />
        </div>
        {/* --- FIM DA MUDANÇA --- */}

        <h2>Vamos criar sua loja!</h2>
        <p>Comece com o básico. Você poderá adicionar todos os detalhes de endereço, contato e horários depois.</p>

        {/* Campo para Nome da Loja */}
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

        {/* Campo para Descrição */}
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

        {/* Botão de ação */}
        <div className="rodape-acoes">
          {/* Usando a mesma classe de botão para manter o estilo */}
          <button type="submit" className="btn-salvar">
            Criar Loja e Personalizar
          </button>
        </div>

      </form>
    </div>
  );
};

export default CadastrarLoja;