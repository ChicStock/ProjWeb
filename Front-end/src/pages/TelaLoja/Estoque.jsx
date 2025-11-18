import React from 'react';
import './Estoque.css';

const dadosEstoque = [
  {
    nome: 'Calça Jeans A',
    imagem: '/path/to/jeans-a-image.png', 
    tamanhos: [
      { tam: '36', qtdDisponivel: 10 },
      { tam: '38', qtdDisponivel: 5 },
      { tam: '40', qtdDisponivel: 8 },
      { tam: '42', qtdDisponivel: 4 },
    ],
  },
  {
    nome: 'Calça Jeans C',
    imagem: '/path/to/jeans-c-image.png', 
    tamanhos: [
      { tam: '36', qtdDisponivel: 2 },
      { tam: '38', qtdDisponivel: 3 },
      { tam: '40', qtdDisponivel: 1 },
      { tam: '42', qtdDisponivel: 12 },
    ],
  },
  {
    nome: 'Jaqueta Leve',
    imagem: '/path/to/jaqueta-leve-image.png', 
    tamanhos: [
      { tam: 'PP', qtdDisponivel: 5 },
      { tam: 'P', qtdDisponivel: 8 },
      { tam: 'M', qtdDisponivel: 2 },
      { tam: 'G', qtdDisponivel: 11 },
    ],
  },
  {
    nome: 'Jaquetão',
    imagem: '/path/to/jaquetao-image.png', 
    tamanhos: [
      { tam: 'P', qtdDisponivel: 1 },
      { tam: 'M', qtdDisponivel: 3 },
      { tam: 'G', qtdDisponivel: 7 },
      { tam: 'GG', qtdDisponivel: 2 },
    ],
  },
];

const Estoque = () => {
  return (
    <div className="container-principal">
      <header className="cabecalho-estoque">
        <div className="titulo-estoque">
          <img src="/path/to/back-arrow.png" alt="Voltar" className="icone-voltar" />
          <h1>Meu Estoque</h1>
        </div>
        <div className="logo-estoque">
          <img src="/path/to/logo-chic-stock.png" alt="Chic Stock" />
        </div>
      </header>

      <main className="grid-estoque">
        {dadosEstoque.map((produto, index) => (
          <div key={index} className="card-produto">
            <div className="cabecalho-card">
              <h3>{produto.nome}</h3>
              <img src={produto.imagem} alt={produto.nome} className="imagem-produto" />
            </div>
            <table className="tabela-estoque">
              <thead>
                <tr>
                  <th>Tam</th>
                  <th>Qtd Disponível</th>
                </tr>
              </thead>
              <tbody>
                {produto.tamanhos.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.tam}</td>
                    <td>{item.qtdDisponivel} unidades</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Estoque;