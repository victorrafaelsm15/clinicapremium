import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h2>Dra. Nome da Profissional</h2>
        <span>Especialista em Emagrecimento</span>
      </div>

      <nav>
        <a href="#sobre">Sobre</a>
        <a href="#servicos">Serviços</a>
        <a href="#resultados">Resultados</a>
        <a href="#agendamento">Agendamento</a>
        <a href="#contato">Contato</a>
      </nav>

      <a href="https://wa.me/5500000000000" className="btn-header" target="_blank">
        WhatsApp
      </a>
    </header>
  );
}

export default Header;