
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/login'; 
import Cadastro from './pages/cadastro';
import TelaInicial from './componentes/TelaInicial'
import RelatorioVendas from "./pages/RelatorioVendas.jsx";
import CadastrarLoja from "./pages/CadastrarLoja.jsx"
import PersonalizarLoja from "./pages/PersonalizarLoja.jsx"


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

    </Routes>
  );
}

export default App;