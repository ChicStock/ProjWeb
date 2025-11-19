import './cadastro.css'
import Logo1 from '../../assets/Logo1.png'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Cadastro() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cpf: '',
    senha: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cpfLimpo = formData.cpf.replace(/\D/g, '');
    const telefoneLimpo = formData.telefone.replace(/\D/g, '');

    const dataToSubmit = {
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      email: formData.email,
      senha: formData.senha,
      cpf: cpfLimpo,       
      telefone: telefoneLimpo 
    };

    try {
      await axios.post('http://localhost:8080/api/v1/usuarios', dataToSubmit);
      
      alert('Cadastro realizado com sucesso!');
      navigate('/login');

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      let errorMessage = 'Erro ao realizar cadastro.';

      if (error.response) {
        const dados = error.response.data;
        if (dados.errors && Array.isArray(dados.errors)) {
             errorMessage = "Erro: " + dados.errors[0].defaultMessage; 
        } else if (dados.message) {
             errorMessage = dados.message;
        }
      } else if (error.code === "ERR_NETWORK") {
          errorMessage = 'Não foi possível conectar ao servidor.';
      }

      alert(errorMessage);
    }
  };

  return (
    <header id="Pagina">
      <nav>
        <img src={Logo1} className="logo1" alt="Logo" />
      </nav>
      <h1>Vamos realizar seu cadastro:</h1>
      
      <form className="menu" onSubmit={handleSubmit}>
        
        <input 
          type="text" 
          placeholder="Digite seu nome..." 
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          maxLength="100"
        />
        
        <input 
          type="text" 
          placeholder="Digite seu sobrenome..." 
          name="sobrenome"
          value={formData.sobrenome}
          onChange={handleChange}
          required
          maxLength="100"
        />
        
        <input 
          type="email" 
          placeholder="Digite seu email..."
          name="email"
          value={formData.email}
          onChange={handleChange}
          required 
          maxLength="150"
        />

        <div className="input-group">
            <input 
            type="password" 
            placeholder='Crie uma senha forte...'
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required 
            minLength="8"
            maxLength="20"
            />
            <small className="helper-text">
                A senha deve ter no mínimo 8 caracteres e conter pelo menos uma letra maiúscula, uma letra minúscula e um número.
            </small>
        </div>

        {/* GRUPO CPF */}
        <div className="input-group">
            <input 
            type="text"
            placeholder='Digite seu CPF (apenas números)...'
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required 
            maxLength="11"
            />
            <small className="helper-text">
                Digite exatamente os 11 números (sem pontos ou traços).
            </small>
        </div>

        <div className="input-group">
            <input 
            type="tel" 
            placeholder="Digite seu telefone..."
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            required 
            maxLength="11"
            />
            <small className="helper-text">
                Formato: DDD + Número (Ex: 85999998888). Apenas números.
            </small>
        </div>

        <button type="submit">Cadastrar</button>
      </form>
      <div className="register-link-container">
        <p>
          Já tem conta? <Link to="/login" className="register-link">Faça login</Link>
        </p>
      </div>

    </header>
  );
}

export default Cadastro;