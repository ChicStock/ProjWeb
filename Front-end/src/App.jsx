
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/TelaLoja/login.jsx'; 
import Cadastro from './pages/TelaLoja/cadastro.jsx';
import TelaInicial from './pages/TelaCliente/TelaInicial.jsx'
import RelatorioVendas from "./pages/TelaLoja/RelatorioVendas.jsx";
import CadastrarLoja from "./pages/TelaLoja/CadastrarLoja.jsx"
import PersonalizarLoja from "./pages/TelaLoja/PersonalizarLoja.jsx"
import MeusPedidos from "./pages/TelaCliente/MeusPedidos.jsx"

function App() {
  return (

    <Routes>
      
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/Telainicial" element={<TelaInicial/>}/>
      <Route path="/RelatorioVendas" element={<RelatorioVendas/>}/>
      <Route path="/CadastrarLoja" element={<CadastrarLoja/>}/>
      <Route path="/PersonalizarLoja/:id" element={<PersonalizarLoja/>}/>
      <Route path="/MeusPedidos" element={<MeusPedidos/>}/>

    </Routes>
  );
}

export default App;