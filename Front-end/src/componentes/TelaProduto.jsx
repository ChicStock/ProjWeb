import Navbar from "./NavBar";
import { Button, Container } from "react-bootstrap";
import { BsBag } from "react-icons/bs";
import "./TelaProduto.css";

function TelaProduto() {
  return (
    <>
      <Navbar />

      <Container className="tela-produto">
        <div className="produto-card shadow">
          <div className="produto-id canto">ID: 2233441</div>

          <div className="produto-header">
            <h2 className="produto-nome">BLUSA DO GOKU</h2>
          </div>

          <div className="produto-conteudo">
            <div className="produto-imagem-placeholder">
              <p>Imagem do produto</p>
            </div>

            <div className="produto-info">
              <p className="produto-descricao">
                Blusa feita de algodão, com costura feita à mão e com o desenho
                do personagem Goku.
              </p>

              <div className="produto-preco">
                <label>Valor:</label>
                <span>R$ 47,00</span>
              </div>

              <div className="produto-tamanhos">
                <label>Tamanhos:</label>
                <div className="tamanho-lista">
                  {["PP", "P", "M", "G", "GG", "XG"].map((t) => (
                    <button key={t} className="tamanho-btn">
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="produto-botoes">
                <Button variant="outline-secondary" className="btn-sacola">
                  <BsBag className="me-2" />
                  Adicionar à sacola
                </Button>
                <Button variant="secondary" className="btn-comprar">
                  Comprar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="outros-produtos mt-5">
          <h3>Outros Produtos</h3>

          <div className="produtos-lista">
            <div className="produtos-card">
              <div className="produtos-logo-placeholder" />
              <p className="produtos-nome">Blusa 2</p>
            </div>

            <div className="produtos-card">
              <div className="produtos-logo-placeholder" />
              <p className="produtos-nome">Blusa 3</p>
            </div>

            <div className="produtos-card">
              <div className="produtos-logo-placeholder" />
              <p className="produtos-nome">Blusa</p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default TelaProduto;