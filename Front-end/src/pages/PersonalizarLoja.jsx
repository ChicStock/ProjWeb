import React from 'react';
import './PersonalizarLoja.css';
import { FiEdit2 } from 'react-icons/fi';
import logoLoja from '../assets/loja2.png';
import logosite from '../assets/logo2teste.png'

const PersonalizarLoja = () => {
  return (
    <div className="personalizacao-wrapper">
      <div className="logo-externo">
        <img src={logosite}/>
      </div>

      <div className="personalizacao-container">
        <div className="coluna-esquerda">
          <div className="perfil-foto-container">
            <img src={logoLoja} alt="Logo da Loja" className="perfil-foto" />
            <a href="#" className="alterar-foto-link">
              Alterar Foto
            </a>
          </div>

          <div className="campo-container">
            <label>Endereço:</label>
            <div className="campo-editavel">
              <div className="multi-line">
                <p>Rua das Palmeiras, 1250</p>
                <p>Bairro: Jardim Central</p>
                <p>Fortaleza - CE</p>
                <p>CEP: 60123-456</p>
              </div>
              <FiEdit2 className="edit-icon" />
            </div>
          </div>

          <div className="campo-container">
            <label>Entrega:</label>
            <div className="campo-editavel">
              <p>A combinar</p>
              <FiEdit2 className="edit-icon" />
            </div>
          </div>
        </div>
        <div className="coluna-direita">
          <div className="campo-container">
            <label>Nome:</label>
            <div className="campo-editavel">
              <p>Max Maize</p>
              <FiEdit2 className="edit-icon" />
            </div>
          </div>

          <div className="campo-container">
            <label>Descrição:</label>
            <div className="campo-editavel">
              <p>Jeans de verdade, estilo sem limites.</p>
              <FiEdit2 className="edit-icon" />
            </div>
          </div>

          <div className="campo-container">
            <label>Horário de Funcionamento:</label>
            <div className="campo-editavel">
              <div className="multi-line">
                <p>Segunda à Sexta - 9h às 16h</p>
                <p>Sábado - 10h às 14h</p>
                <p>Domingo - Fechado</p>
              </div>
              <FiEdit2 className="edit-icon" />
            </div>
          </div>

          <div className="campo-container">
            <label>Contato:</label>
            <div className="campo-editavel">
              <div className="multi-line">
                <p>Telefone/WhatsApp: (85) 91234-5678</p>
                <p>E-mail: contato@maxmaize.com</p>
                <p>Instagram: @lojamaxmaize</p>
              </div>
              <FiEdit2 className="edit-icon" />
            </div>
          </div>

          <div className="campo-container">
            <label>Formas de pagamento:</label>
            <div className="campo-editavel">
              <p>Cartão de Crédito e Pix</p>
              <FiEdit2 className="edit-icon" />
            </div>
          </div>

          <div className="rodape-acoes">
            <button className="btn-salvar">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizarLoja;