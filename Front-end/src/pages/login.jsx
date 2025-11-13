import './login.css'
import Logo1 from '../assets/Logo1.png'
import { useState } from 'react'; 
import axios from 'axios'; 
// 1. IMPORTAR O 'useNavigate' e o 'Link'
import { useNavigate, Link } from 'react-router-dom';

function Login () {
  // 2. ATIVAR O 'useNavigate'
  // O 'navigate' é uma função que nos permite forçar a navegação
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    senha: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // --- MODO DE TESTE DE NAVEGAÇÃO (BACK-END DESLIGADO) ---
    // Como o back-end não está funcionando, vamos pular a chamada axios
    // e ir direto para a navegação para testar o fluxo de telas.

    alert('Simulando login bem-sucedido para testar navegação...');
    // Vamos simular que salvamos um token para testes
    localStorage.setItem('authToken', 'fake-token-para-teste'); 
    
    // Navega direto para a tela inicial (o que aconteceria no sucesso)
    navigate('/Telainicial'); 

    // --- CÓDIGO ORIGINAL (PARA QUANDO O BACK-END VOLTAR) ---
    /*
    try {
      const response = await axios.post('http://localhost:8080/auth/login', credentials);

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        
        alert('Login realizado com sucesso!');
        
        // 3. USAR O 'navigate' APÓS O SUCESSO DO LOGIN
        // Isso vai te redirecionar para a página principal do app
        navigate('/Telainicial'); // ROTA ATUALIZADA de '/dashboard' para '/Telainicial'

      } else {
        alert('Login bem-sucedido, mas não recebi um token.');
      }

    } catch (error) {
      console.error('Erro no login:', error.response ? error.response.data : error.message);
      alert('Email ou senha incorretos.');
    }
    */
    // --- FIM DO CÓDIGO ORIGINAL ---
  };

  return (
    <header id="Pagina">
      <nav>
        <img src={Logo1} className="logo1" alt="Logo" />
      </nav>
      <h1>Vamos realizar seu Login:</h1>
      
      <form className="menu" onSubmit={handleSubmit}>
        
        <input 
          type="email" 
          placeholder="Digite seu email..." 
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input 
          type="password" 
          placeholder='digite sua senha...' 
          name="senha"
          value={credentials.senha}
          onChange={handleChange}
          required
        />
        
        <button type="submit">Entrar</button>
      </form>
      <div className="register-link-container">
        <p>
          Não tem conta? <Link to="/cadastro" className="register-link">Cadastre-se</Link>
        </p>
      </div>

    </header>
  );
} 

export default Login;