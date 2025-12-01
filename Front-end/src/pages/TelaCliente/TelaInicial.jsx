import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"; 
import "./TelaInicial.css";

import LojaDefault from "../../assets/loja2.png";
import Banner1 from "../../assets/Loja4.png";
import Banner2 from "../../assets/Loja5.png";
import Banner3 from "../../assets/ChicStock.png";
import CadastreBanner from "../../assets/Cadastre.png";
import { FiArrowRight, FiShoppingBag, FiAlertCircle } from "react-icons/fi";

const API_URL = "http://localhost:8080";

function TelaInicial() {
    const navigate = useNavigate();

    const [lojas, setLojas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const banners = [Banner1, Banner2, Banner3];
    const [indiceBanner, setIndiceBanner] = useState(0);

    useEffect(() => {
        const intervalo = setInterval(() => {
            setIndiceBanner((prev) => (prev + 1) % banners.length);
        }, 4000); 
        return () => clearInterval(intervalo);
    }, [banners.length]);

    useEffect(() => {
        const fetchLojas = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/lojas`);
                setLojas(response.data);
            } catch (error) {
                console.error("Erro ao buscar lojas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLojas();
    }, []);

    const handleBannerClick = () => {
        const token = localStorage.getItem('authToken'); 
        if (token) {
            navigate("/CadastrarLoja");
        } else {
            setShowModal(true);
        }
    };

    const irParaLogin = () => {
        navigate("/login");
    };

    return (
        <div className="home-page">
            <Navbar />

            <div className="hero-carousel">
                {banners.map((banner, index) => (
                    <div 
                        key={index} 
                        className={`carousel-slide ${index === indiceBanner ? "ativo" : ""}`}
                    >
                        <img src={banner} alt={`Banner ${index + 1}`} />
                        <div className="carousel-caption">
                            <h2>Bem-vindo à Chic Stock</h2>
                            <p>O maior marketplace de atacado de moda.</p>
                        </div>
                    </div>
                ))}
                
                <div className="carousel-dots">
                    {banners.map((_, idx) => (
                        <span 
                            key={idx} 
                            className={`dot ${idx === indiceBanner ? "active" : ""}`}
                            onClick={() => setIndiceBanner(idx)}
                        ></span>
                    ))}
                </div>
            </div>

            <section className="section-lojas">
                <div className="section-header">
                    <h2>Lojas em Destaque</h2>
                    <p>Descubra os melhores fornecedores</p>
                </div>

                {loading ? (
                    <p className="loading-text">Carregando vitrine...</p>
                ) : (
                    <div className="grid-lojas">
                        {lojas.length > 0 ? lojas.map((loja) => (
                            <Link to={`/loja/${loja.id}`} key={loja.id} className="card-loja">
                                <div className="card-image">
                                    <img 
                                        src={loja.imgUrl ? `${API_URL}${loja.imgUrl}` : LojaDefault} 
                                        alt={loja.nome} 
                                        onError={(e) => { e.target.src = LojaDefault; }}
                                    />
                                    
                                    <span className="badge-novo">Novo</span>
                                </div>
                                <div className="card-info">
                                    <h3>{loja.nome}</h3>
                                    <p>{loja.descricao ? loja.descricao.substring(0, 60) + "..." : "Moda e estilo para você."}</p>
                                    <span className="link-ver">Visitar Loja <FiArrowRight /></span>
                                </div>
                            </Link>
                        )) : (
                            <div className="empty-state">
                                <FiShoppingBag size={40} />
                                <p>Nenhuma loja encontrada.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            <section className="cadastro-section">
                <div className="banner-cadastro" onClick={handleBannerClick}>
                    <img src={CadastreBanner} alt="Cadastre sua loja" />
                </div>
            </section>

            <footer className="home-footer">
                <p>© 2025 Chic Stock - Moda que Conecta.</p>
            </footer>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-icon">
                            <FiAlertCircle size={50} color="#9b9490" />
                        </div>
                        <h3>Atenção</h3>
                        <p>Para cadastrar sua loja, você precisa fazer login ou criar uma conta primeiro.</p>
                        
                        <div className="modal-actions">
                            <button className="btn-cancelar" onClick={() => setShowModal(false)}>
                                Agora não
                            </button>
                            <button className="btn-confirmar" onClick={irParaLogin}>
                                Fazer Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TelaInicial;