import React, { useState } from 'react';
import './CadastrarLoja.css';
import logosite from '../../assets/logo1.png'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CadastrarLoja = () => {
  const navigate = useNavigate();
  
  const [nomeLoja, setNomeLoja] = useState('');
  const [cnpj, setCnpj] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert("Você precisa logar primeiro!");
        navigate('/login');
        return;
    }

    const cnpjLimpo = cnpj.replace(/\D/g, '');

    if (cnpjLimpo.length !== 14) {
        alert("O CNPJ é obrigatório e deve conter exatamente 14 números.");
        return;
    }

    const dataToSubmit = { 
        nome: nomeLoja,
        cnpj: cnpjLimpo 
    };

    console.log("Enviando:", dataToSubmit);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/lojas', dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const novaLojaId = response.data.id; 

      if (novaLojaId) {

          localStorage.setItem('lojaId', novaLojaId);

          window.dispatchEvent(new Event('auth-update'));
      }


      alert('Loja criada com sucesso!');
      navigate(`/personalizarLoja/${novaLojaId}`); 

    } catch (error) {
       console.error('Erro detalhado:', error);
       
       let msg = 'Erro ao criar a loja.';
       if (error.response && error.response.data) {
           if (error.response.data.message) msg += ` ${error.response.data.message}`;
       }
       alert(msg);
    }
  };

  return (
    <div className="cadastro-loja-wrapper">
      
      <div className="logo-externo-cadastro">
        <img src={logosite} alt="Logo Site" />
      </div>

      <form className="cadastro-loja-container" onSubmit={handleSubmit}>
        
        <h2>Vamos criar sua loja!</h2>
        <p>Insira os dados básicos para começar.</p>

        <div className="campo-container">
          <label htmlFor="nomeLoja">Nome da Loja:</label>
          <div className="input-visual">
            <input
                type="text"
                id="nomeLoja"
                value={nomeLoja}
                onChange={(e) => setNomeLoja(e.target.value)}
                placeholder="Ex: Max Maize"
                required
                maxLength="200"
            />
          </div>
        </div>

        <div className="campo-container">
          <label htmlFor="cnpj">CNPJ:</label>
          <div className="input-visual">
            <input
                type="text"
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
                required
                maxLength="18"
            />
          </div>
        </div>

        <div className="rodape-acoes">
          <button type="submit" className="btn-salvar">
            Criar Loja
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastrarLoja;