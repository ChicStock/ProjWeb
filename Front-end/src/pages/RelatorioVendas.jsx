import React from 'react';
import './RelatorioVendas.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dadosVendas = [
  {
    criacao: '02/04/2025\n14:30',
    numeroPedido: 82,
    cliente: {
      nome: 'Luiza Maria Silva',
      email: 'lulu123@gmail.com',
      telefone: '85981562340',
    },
    produto: '2x - Calça Jeans A (Tamanho 38)\n1x - Jaqueta Leve (Tamanho M)',
    ganho: 'R$110,00',
  },
  {
    criacao: '10/04/2025\n19:45',
    numeroPedido: 83,
    cliente: {
      nome: 'Marta da Costa Mendes',
      email: 'martacosta@gmail.com',
      telefone: '85978632480',
    },
    produto: '1x - Calça Jeans A (Tamanho 42)',
    ganho: 'R$580,00',
  },
  {
    criacao: '12/04/2025\n15:00',
    numeroPedido: 84,
    cliente: {
      nome: 'João Oliveira Neto',
      email: 'olivjoao@gmail.com',
      telefone: '85987563210',
    },
    produto: '1x Jaquetão (Tamanho GG)',
    ganho: 'R$565,00',
  },
];

const dadosGrafico = [
  { nome: 'Calça A', vendas: 9 },
  { nome: 'Jaqueta Leve', vendas: 2 },
  { nome: 'Calça B', vendas: 11 },
  { nome: 'Blusa Frio', vendas: 5 },
  { nome: 'Calça C', vendas: 15 },
  { nome: 'Jaquetão', vendas: 8 },
];

const RelatorioVendas = () => {
  return (
    <div className="container-principal">
      <header className="cabecalho">
        <div className="logo">
          <img src="/path/to/your/logo.png" alt="Chic Stock" />
          <div className="texto-logo">
            <span>Chic Stock</span>
            <small>Atacado de Moda</small>
          </div>
        </div>
      </header>

      <main className="conteudo-principal">
        <div className="painel-vendas">
          <div className="secao-grafico">
            <div className="cabecalho-grafico">
              <h2>Gráfico de Vendas</h2>
              <div className="seletor-periodo">
                <span>Selecionar período:</span>
                <input type="text" value="01/04 a 30/04" readOnly />
              </div>
            </div>
            <div className="container-grafico">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="vendas" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="resumo-vendas">
            <div className="total-vendas">
              <span>Total de vendas:</span>
              <p>R$ 2.500,00</p>
            </div>
            <div className="estatisticas-vendas">
              <div className="pedidos-pagos">
                <span>Pedidos pagos:</span>
                <p>30</p>
              </div>
              <div className="pedidos-aberto">
                <span>Pedidos em aberto:</span>
                <p>0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-tabela-vendas">
          <table className="tabela-vendas">
            <thead>
              <tr>
                <th>Criação</th>
                <th>Nº Pedido</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Ganho</th>
              </tr>
            </thead>
            <tbody>
              {dadosVendas.map((item, index) => (
                <tr key={index}>
                  <td>{item.criacao.split('\n').map((linha, i) => <div key={i}>{linha}</div>)}</td>
                  <td>{item.numeroPedido}</td>
                  <td>
                    <div>{item.cliente.nome}</div>
                    <small>{item.cliente.email}</small>
                    <div>{item.cliente.telefone}</div>
                  </td>
                  <td>{item.produto.split('\n').map((linha, i) => <div key={i}>{linha}</div>)}</td>
                  <td>{item.ganho}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default RelatorioVendas;