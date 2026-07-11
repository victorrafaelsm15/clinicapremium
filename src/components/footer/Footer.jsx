import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h2>Dra. Nome da Profissional</h2>
          <p>
            Atendimento profissional com foco em saúde, estética, qualidade de vida
            e acompanhamento personalizado.
          </p>
        </div>

        <div>
          <h3>Links rápidos</h3>
          <a href="#sobre">Sobre</a>
          <a href="#servicos">Serviços</a>
          <a href="#resultados">Resultados</a>
          <a href="#agendamento">Agendamento</a>
        </div>

        <div>
          <h3>Contato</h3>
          <p>WhatsApp: (00) 00000-0000</p>
          <p>Instagram: @seuinstagram</p>
          <p>Rua Exemplo, 123 - Centro</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Dra. Nome da Profissional. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;