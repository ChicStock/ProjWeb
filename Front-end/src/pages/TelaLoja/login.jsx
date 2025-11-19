import './login.css'
import Logo1 from '../../assets/Logo1.png'
import { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate, Link } from 'react-router-dom';

function Login () {
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

    const dadosParaEnvio = {
        email: credentials.email,
        senha: credentials.senha
    };

    try {

      const response = await axios.post('http://localhost:8080/auth/login', dadosParaEnvio);

      const token = response.data.token || response.data;

      if (token) {
 
        localStorage.setItem('authToken', token);
        
        navigate('/Telainicial'); 
      } else {
        alert('Erro estranho: Login deu certo (200 OK), mas não veio token.');
      }

    } catch (error) {
      console.error('Erro no login:', error);
      
      let msg = 'Falha no login.';

      if (error.response) {

        if (error.response.status === 403 || error.response.status === 401) {
            msg = 'Email ou senha incorretos.';
        } else {
            msg = error.response.data.message || error.response.data || 'Erro no servidor.';
        }
      } else if (error.code === "ERR_NETWORK") {
        msg = 'O servidor está desligado ou inacessível.';
      }

      alert(msg);
    }
  };

  return (
    <header id="Pagina">
      <nav>
        <img src={Logo1} className="logo1" alt="Logo" />
      </nav>
      <h1>Vamos realizar seu Login:</h1>
      
      <form className="menu" onSubmit={handleSubmit}>
        <div className="input-group">
            <input 
            type="email" 
            placeholder="Digite seu email..." 
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            />
        </div>

        <div className="input-group">
            <input 
            type="password" 
            placeholder="Digite sua senha..." 
            name="senha"
            value={credentials.senha}
            onChange={handleChange}
            required
            />
        </div>
        
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