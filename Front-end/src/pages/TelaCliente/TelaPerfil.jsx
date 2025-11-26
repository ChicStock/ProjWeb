import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./TelaPerfil.css";
import { FiUser, FiMapPin, FiEdit2, FiSave, FiX, FiCamera } from "react-icons/fi";
import axios from "axios";

function TelaPerfil() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [dados, setDados] = useState({
    nome: "", sobrenome: "", email: "", cpf: "", telefone: "",
    cep: "", rua: "", numero: "", bairro: "", cidade: "", uf: "", complemento: ""
  });

  const [backupDados, setBackupDados] = useState({});

  useEffect(() => {
    const fetchPerfil = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) { setLoading(false); return; }

        try {
            const response = await axios.get('http://localhost:8080/api/v1/usuarios/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = response.data;
            const end = user.endereco || {};

            setDados({
                nome: user.nome || "",
                sobrenome: user.sobrenome || "",
                email: user.email || "",
                cpf: user.cpf || "",
                telefone: user.telefone || "",
                cep: end.cep || "",
                rua: end.rua || "",
                numero: end.numero || "",
                bairro: end.bairro || "",
                cidade: end.cidade || "",
                uf: end.estado || "",
                complemento: end.complemento || ""
            });
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchPerfil();
  }, []);

  const handleEdit = () => {
      setBackupDados({ ...dados });
      setIsEditing(true);
  };

  const handleCancel = () => {
      setDados(backupDados);
      setIsEditing(false);
  };

  const handleSave = async (e) => {
      e.preventDefault();
      setLoading(true);
      const token = localStorage.getItem('authToken');

      const payload = {
          nome: dados.nome,
          sobrenome: dados.sobrenome,
          telefone: dados.telefone,
          endereco: {
              cep: dados.cep,
              rua: dados.rua,
              numero: dados.numero,
              complemento: dados.complemento,
              estado: dados.uf
          }
      };

      try {
          await axios.put('http://localhost:8080/api/v1/usuarios/me', payload, {
              headers: { Authorization: `Bearer ${token}` }
          });
          alert("Perfil atualizado com sucesso!");
          setIsEditing(false);
      } catch (error) {
          alert("Erro ao salvar alterações.");
      } finally {
          setLoading(false);
      }
  };

  const handleChange = (e) => {
      const { name, value } = e.target;
      setDados(prev => ({ ...prev, [name]: value }));
  };

  if (loading && !dados.email) return <div className="p-loading">Carregando perfil...</div>;

  return (
    <div className="p-page-wrapper">
      <Navbar />

      <div className="p-container">
        <div className="p-header-card">
            <div className="p-avatar-area">
                <div className="p-avatar-circle">
                    <FiUser size={50} />
                    {isEditing && <button className="p-btn-icon" type="button"><FiCamera /></button>}
                </div>
                <div className="p-welcome-text">
                    <h1>Olá, {dados.nome || "Usuário"}</h1>
                    <p>Gerencie seus dados e endereço</p>
                </div>
            </div>

            <div className="p-header-actions">
                {!isEditing ? (
                    <button className="p-btn p-btn-edit" onClick={handleEdit} type="button">
                        <FiEdit2 /> Editar Perfil
                    </button>
                ) : (
                    <div className="p-actions-group">
                        <button className="p-btn p-btn-cancel" onClick={handleCancel} type="button">
                            <FiX /> Cancelar
                        </button>
                        <button className="p-btn p-btn-save" onClick={handleSave} disabled={loading} type="button">
                            <FiSave /> {loading ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                )}
            </div>
        </div>

        <form className="p-content-grid" onSubmit={handleSave}>
            
            <div className="p-card">
                <div className="p-card-title"><FiUser /> Dados Pessoais</div>
                
                <div className="p-inputs-grid">
                    <div className="p-input-box">
                        <label>Nome</label>
                        <input type="text" name="nome" value={dados.nome} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div className="p-input-box">
                        <label>Sobrenome</label>
                        <input type="text" name="sobrenome" value={dados.sobrenome} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div className="p-input-box p-full-width">
                        <label>Email</label>
                        <input type="email" value={dados.email} disabled={true} className="p-input-fixed"/>
                    </div>
                    <div className="p-input-box">
                        <label>CPF</label>
                        <input type="text" value={dados.cpf} disabled={true} className="p-input-fixed"/>
                    </div>
                    <div className="p-input-box">
                        <label>Telefone</label>
                        <input type="text" name="telefone" value={dados.telefone} onChange={handleChange} disabled={!isEditing} />
                    </div>
                </div>
            </div>

            <div className="p-card">
                <div className="p-card-title"><FiMapPin /> Endereço de Entrega</div>
                
                <div className="p-inputs-grid">
                    <div className="p-input-box">
                        <label>CEP</label>
                        <input type="text" name="cep" value={dados.cep} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div className="p-input-box">
                        <label>Estado (UF)</label>
                        <input type="text" name="uf" value={dados.uf} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div className="p-input-box p-full-width">
                        <label>Rua / Avenida</label>
                        <input type="text" name="rua" value={dados.rua} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div className="p-input-box">
                        <label>Número</label>
                        <input type="text" name="numero" value={dados.numero} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div className="p-input-box">
                        <label>Bairro</label>
                        <input type="text" name="bairro" value={dados.bairro} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div className="p-input-box">
                        <label>Cidade</label>
                        <input type="text" name="cidade" value={dados.cidade} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div className="p-input-box">
                        <label>Complemento</label>
                        <input type="text" name="complemento" value={dados.complemento} onChange={handleChange} disabled={!isEditing} />
                    </div>
                </div>
            </div>

        </form>
      </div>
    </div>
  );
}

export default TelaPerfil;