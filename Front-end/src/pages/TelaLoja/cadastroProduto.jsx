import React, { useState } from "react";
import "./cadastroProduto.css";

function Cadastroproduto() {
  const [produto, setProduto] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    estoque: "",
    valor: "",
    foto: null,
  });

  return (
    <div className="cadastro-bg">
      <div className="cadastro-container">
        <div className="form-section">
          <h2 className="form-title">Cadastrar Produto</h2>
          <hr className="form-divider" />
          <form>
            <input
              className="form-input"
              placeholder="Nome:"
              value={produto.nome}
              onChange={e =>
                setProduto({ ...produto, nome: e.target.value })
              }
            />
            <select
              className="form-input"
              value={produto.categoria}
              onChange={e =>
                setProduto({ ...produto, categoria: e.target.value })
              }
            >
              <option value="">Categoria:</option>
              <option value="camisetas">Camisetas</option>
              <option value="acessorios">Acessórios</option>
            </select>
            <input
              className="form-input"
              placeholder="Descrição:"
              value={produto.descricao}
              onChange={e =>
                setProduto({ ...produto, descricao: e.target.value })
              }
            />
            <select
              className="form-input"
              value={produto.estoque}
              onChange={e =>
                setProduto({ ...produto, estoque: e.target.value })
              }
            >
              <option value="">Estoque:</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
            <input
              className="form-input"
              placeholder="Valor:"
              value={produto.valor}
              onChange={e =>
                setProduto({ ...produto, valor: e.target.value })
              }
            />
            <button
              className="form-button"
              type="button"
            >
              Cadastrar
            </button>
          </form>
        </div>
        <div className="imagem-section">
          <span className="imagem-id">ID: 89</span>
          <label className="imagem-label">
            <span className="imagem-icone">👕</span>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
            />
          </label>
          <span className="imagem-text">Adicionar foto</span>
        </div>
      </div>
      <div className="logo-footer">
        <span className="logo-text">Chic Stock</span>
        <span className="logo-sub">MODA QUE CONECTA</span>
      </div>
    </div>
  );
}

export default Cadastroproduto;
