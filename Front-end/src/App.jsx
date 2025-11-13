import React from 'react' 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import TelaInicial from './componentes/TelaInicial'
import Navbar from './componentes/NavBar';
import TelaLoja from './componentes/TelaLoja';
import Telacadastro from './pages/cadastroProduto';
import FinalizarPedido from './componentes/FinalizarPedido';
import TrocarEndereco from './componentes/TrocarEndereco';
import FormaPagamento from './componentes/FormaPagamento';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import TelaProduto from './componentes/TelaProduto';
import MeusPedidos from './componentes/MeusPedidos';

function App() {

  return (
    <>
    <TelaInicial/>
    </>
  )
}

export default App
