import './cadastro.css'
import Logo1 from '../assets/Logo1.png'

function Cadastro() {
  return (
    <header id="Pagina">
      <nav>
        <img src={Logo1} className="logo1" />
      </nav>
      <h1>Vamos realizar seu cadastro:</h1>
      <div className="menu">
        <input type="email" placeholder="Digite seu email..." />
        <input type="password" placeholder='digite sua senha...' />
        <button>Cadastrar</button>
      </div>
    </header>
  );
}

export default Cadastro;
