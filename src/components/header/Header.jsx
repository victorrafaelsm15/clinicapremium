import { useState } from "react";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setMenuOpen(false);
  }

  return (
    <header className="header">
      <div className="header-content">
        <button
          type="button"
          className="brand-mark"
          onClick={() => scrollToSection("inicio")}
          aria-label="Voltar ao início"
        >
          +
        </button>

        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
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

          <button
            type="button"
            onClick={() => scrollToSection("contato")}
          >
            Contato
          </button>

          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noreferrer"
            className="header-whatsapp mobile-whatsapp"
          >
            WhatsApp
          </a>
        </nav>

        <a
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noreferrer"
          className="header-whatsapp desktop-whatsapp"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}

export default Header;