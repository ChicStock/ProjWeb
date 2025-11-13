import './cadastro.css'
import Logo1 from '../assets/Logo1.png'
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

    const dataToSubmit = {
      ...formData,
      role: 'USER'
    };

    try {

      await axios.post('http://localhost:8080/auth/register', dataToSubmit);
      
      alert('Cadastro realizado com sucesso!');
      
      navigate('/login');

    } catch (error) {
      console.error('Erro ao cadastrar:', error.response ? error.response.data : error.message);
      
      let errorMessage = 'Erro ao realizar cadastro.';

      if (error.response?.status === 400) {
        errorMessage = 'Este email já está cadastrado. Tente outro.';
      }
      alert(errorMessage);
    }
  };

  return (
    <header id="Pagina">
      <nav className="navbar">
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
        />
        <input 
          type="text" 
          placeholder="Digite seu sobrenome..." 
          name="sobrenome"
          value={formData.sobrenome}
          onChange={handleChange}
          required
        />
        <input 
          type="email" 
          placeholder="Digite seu email..."
          name="email"
          value={formData.email}
          onChange={handleChange}
          required 
        />
        <input 
          type="password" 
          placeholder='Digite sua senha...'
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          required 
        />
        <input 
          type="text"
          placeholder='Digite seu CPF...'
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          required 
        />
        <input 
          type="tel" 
          placeholder="Digite seu número de telefone..."
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          required 
        />
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