import "./Footer.css";

function Footer() {
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h2>Clínica Premium</h2>

          <p>
            Atendimento profissional com foco em saúde, autoestima e
            qualidade de vida.
          </p>
        </div>

        <div>
          <h3>Links rápidos</h3>

          <button
            type="button"
            onClick={() => scrollToSection("sobre")}
          >
            Sobre
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("servicos")}
          >
            Serviços
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("resultados")}
          >
            Resultados
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("agendamento")}
          >
            Agendamento
          </button>
        </div>

        <div>
          <h3>Contato</h3>
          <p>WhatsApp: (00) 00000-0000</p>
          <p>Instagram: @seuinstagram</p>
          <p>Rua Exemplo, 123 — Centro</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Clínica Premium. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;