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

function App() {

  return (
    <>
    <FinalizarPedido/>
    </>
  )
}

export default App
