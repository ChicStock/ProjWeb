import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/TelaLoja/login.jsx'; 
import Cadastro from './pages/TelaLoja/cadastro.jsx';
import TelaInicial from './pages/TelaCliente/TelaInicial.jsx'
import RelatorioVendas from "./pages/TelaLoja/RelatorioVendas.jsx";
import CadastrarLoja from "./pages/TelaLoja/CadastrarLoja.jsx"
import PersonalizarLoja from "./pages/TelaLoja/PersonalizarLoja.jsx"
import MeusPedidos from "./pages/TelaCliente/MeusPedidos.jsx"
import FinalizarPedido from "./pages/TelaCliente/FinalizarPedido.jsx"
import TelaLoja from './pages/TelaCliente/TelaLoja.jsx';
import CadastroProduto from './pages/TelaLoja/cadastroProduto.jsx'
import { CartProvider } from './pages/TelaCliente/Carrinho.jsx';
import TelaPerfil from './pages/TelaCliente/TelaPerfil.jsx';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/RelatorioVendas" element={<RelatorioVendas/>}/>
        <Route path="/CadastrarLoja" element={<CadastrarLoja/>}/>
        <Route path="/PersonalizarLoja/:id" element={<PersonalizarLoja/>}/>
        <Route path="/cadastroProduto" element={<CadastroProduto/>}/>
        <Route path="/MeusPedidos" element={<MeusPedidos/>}/>
        <Route path="/FinalizarPedido" element={<FinalizarPedido/>}/>
        <Route path="/loja/:id" element={<TelaLoja/>}/>
        <Route path="/perfil" element={<TelaPerfil />} />
        <Route path="/telainicial" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    
      </Routes>
    </CartProvider>
  );
}

export default App;